/**
 * 📄 RegisterTripComponent
 *
 * 本组件用于司机登记新的旅程 (Trip),
 * 包括验证时间冲突、验证班次 (Turn) 范围，
 * 自动计算旅程距离、预计价格、推荐行程时间，并提交保存。
 *
 * 使用场景: Driver 模块 - Register Trip 页面 (driver/trip/register)
 */

import { Component, OnInit } from '@angular/core';
import { TripService } from '@shared/services/trip/trip.service';
import { Trip } from '@models/trip.model';
import { TurnService } from '@shared/services/turn/turn.service';
import { RequestService } from '@shared/services/request/request.service';
import { Router } from '@angular/router';
import { PriceService } from '@shared/services/price/price.service';

@Component({
  selector: 'app-register-trip',
  templateUrl: './register-trip.component.html',
  styleUrls: ['./register-trip.component.css']
})
export class RegisterTripComponent implements OnInit {

  taxiPlates: string[] = []; // 当前司机名下所有车牌

  trip: Trip = {
    driverName: localStorage.getItem('currentDriverName') || '',
    driverNIF: localStorage.getItem('currentDriverNif') || '',
    clientNIF: '',
    clientName: '',
    from: '',
    to: '',
    startTime: new Date(),
    endTime: new Date(),
    price: 0,
    vehiclePlate: '',
    peopleCount: 1,
    sequenceNumber: 1
  };

  constructor(
    private tripService: TripService,
    private turnService: TurnService,
    private requestService: RequestService,
    private priceService: PriceService,
    private router: Router
  ) {}

  // ✅ 提交旅程信息
  onSubmit(): void {
    const driverName = this.trip.driverName;
    const driverNIF = localStorage.getItem('currentDriverNif') || '';
    const newStart = new Date(this.trip.startTime);
    const newEnd = new Date(this.trip.endTime);

    console.log('🚗 driverNIF:', driverNIF);

    // 📋 校验旅程是否冲突、是否符合班次
    this.tripService.getTripsByDriver(driverName).subscribe({
      next: (existingTrips) => {
        const sequence = existingTrips.filter(t =>
          new Date(t.startTime) < newStart
        ).length + 1;
        this.trip.sequenceNumber = sequence;

        const conflict = existingTrips.some(t => {
          const s = new Date(t.startTime);
          const e = new Date(t.endTime);
          return s < newEnd && e > newStart;
        });

        if (conflict) {
          alert('❌ Já existe uma viagem neste horário.');
          return;
        }

        this.turnService.getTurnsByDriver(driverNIF).subscribe({
          next: (turnos) => {
            const inTurno = turnos.some(t => {
              const s = new Date(t.startTime).getTime();
              const e = new Date(t.endTime).getTime();
              return newStart.getTime() >= s && newEnd.getTime() <= e;
            });

            if (!inTurno) {
              alert('❌ A viagem está fora do horário de turno do motorista.');
              return;
            }

            // ✅ 创建 Trip
            this.tripService.createTrip(this.trip).subscribe({
              next: () => {
                alert('✅ Viagem registada com sucesso!');

                // 📋 标记对应 Request 完成
                const latestRequest = localStorage.getItem('latestRequest');
                if (latestRequest) {
                  const req = JSON.parse(latestRequest);
                  this.requestService.markRequestDone(req._id).subscribe({
                    next: () => console.log('🚫 Pedido marcado como concluído.'),
                    error: err => console.warn('⚠️ Falha ao marcar pedido como concluído:', err)
                  });
                }

                localStorage.removeItem('latestRequest'); // 清除缓存
                this.router.navigate(['/driver/dashboard']); // 跳转
                this.resetForm(); // 重置表单
              },
              error: err => {
                alert('❌ Erro ao registar a viagem.');
                console.error(err);
              }
            });
          },
          error: err => {
            alert('❌ Erro ao verificar turnos.');
            console.error(err);
          }
        });
      },
      error: err => {
        alert('❌ Erro ao verificar viagens anteriores.');
        console.error(err);
      }
    });

    // 🧮 若缺少 kmTraveled, 自动计算
    if (!this.trip.kmTraveled && this.trip.fromLat && this.trip.fromLon && this.trip.toLat && this.trip.toLon) {
      this.trip.kmTraveled = this.calculateDistanceKm(
        this.trip.fromLat, this.trip.fromLon,
        this.trip.toLat, this.trip.toLon
      );
    }
  }

  // 🧹 重置旅程表单
  resetForm(): void {
    this.trip = {
      driverName: localStorage.getItem('currentDriverName') || '',
      driverNIF: localStorage.getItem('currentDriverNif') || '',
      clientNIF: '',
      clientName: '',
      from: '',
      to: '',
      startTime: new Date(),
      endTime: new Date(),
      price: 0,
      vehiclePlate: '',
      peopleCount: 1,
      sequenceNumber: 1
    };
  }

  // 📋 页面初始化
  ngOnInit(): void {
    const latestRequest = localStorage.getItem('latestRequest');
    if (!latestRequest) return;

    const cached = JSON.parse(latestRequest);

    // 🔄 查询请求最新状态
    this.requestService.getRequestStatus(cached._id).subscribe(fresh => {
      if (!fresh.confirmedByClient) {
        alert('⚠️ O cliente ainda não confirmou a viagem.');
        this.router.navigate(['/driver/dashboard']);
        return;
      }

      // 📋 填充旅程基础信息
      this.trip.clientNIF = fresh.nif;
      this.trip.clientName = fresh.name || '';
      this.trip.from = fresh.currentLocation;
      this.trip.to = fresh.destination;
      this.trip.peopleCount = fresh.peopleCount || 1;
      this.trip.fromLat = fresh.currentLat;
      this.trip.fromLon = fresh.currentLon;
      this.trip.toLat = fresh.destLat;
      this.trip.toLon = fresh.destLon;

      this.trip.kmTraveled = this.calculateDistanceKm(
        fresh.currentLat,
        fresh.currentLon,
        fresh.destLat,
        fresh.destLon
      );

      this.estimatePrice(); // 💰估价
    });

    this.loadTaxis(); // 🚕 加载可选车牌
  }

  // 📏 计算两地之间的直线距离 (单位: km)
  calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return +(R * c).toFixed(2); // 保留两位小数
  }

  // 📏 弧度转换
  toRad(value: number): number {
    return value * Math.PI / 180;
  }

  // 🔄 绑定表单时间 (start)
  get formattedStartTime(): string {
    return this.formatDate(this.trip.startTime);
  }
  set formattedStartTime(value: string) {
    this.trip.startTime = new Date(value);
    this.estimatePrice();
  }

  // 🔄 绑定表单时间 (end)
  get formattedEndTime(): string {
    return this.formatDate(this.trip.endTime);
  }
  set formattedEndTime(value: string) {
    this.trip.endTime = new Date(value);
    this.estimatePrice();
  }

  // 🛠️ 本地时间格式化 (解决UTC偏移)
  private formatDate(date: Date): string {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60000);
    return localDate.toISOString().slice(0, 16);
  }

  // 💰 估算价格
  estimatePrice(): void {
    this.priceService.getLatestPrice().subscribe(price => {
      const hour = new Date(this.trip.startTime).getHours();
      const isNight = hour >= 21 || hour < 6;
      const base = price.basic;
      const rate = isNight ? base * (1 + price.nightBonus / 100) : base;

      const durationMin = (new Date(this.trip.endTime).getTime() - new Date(this.trip.startTime).getTime()) / 60000;
      this.trip.price = +(durationMin * rate).toFixed(2);
    });
  }

  // 🚕 加载当前司机所有可选车牌
  loadTaxis(): void {
    const driverNIF = localStorage.getItem('currentDriverNif') || '';
    if (!driverNIF) return;

    this.turnService.getTurnsByDriver(driverNIF).subscribe({
      next: (turns) => {
        this.taxiPlates = Array.from(new Set(turns.map(t => t.taxiPlate).filter(p => p)));
        if (this.taxiPlates.length === 1) {
          this.trip.vehiclePlate = this.taxiPlates[0];
        }
      },
      error: (err) => {
        console.error('❌ Failed to load taxis:', err);
      }
    });
  }

  // 🕒 计算推荐行程时间 (分钟)
  getRecommendedDuration(): string {
    if (!this.trip.fromLat || !this.trip.fromLon || !this.trip.toLat || !this.trip.toLon) {
      return '—';
    }
    const distanceKm = this.calculateDistanceKm(
      this.trip.fromLat, this.trip.fromLon,
      this.trip.toLat, this.trip.toLon
    );
    const speedKmh = 30;
    const timeMin = Math.round((distanceKm / speedKmh) * 60);
    return `${timeMin} min`;
  }

}
