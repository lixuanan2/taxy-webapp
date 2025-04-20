import { Component, OnInit } from '@angular/core';
import { TripService } from '@services/trip.service';
import { Trip } from '@models/trip.model';
import { TurnService } from '@services/turn.service';
import { RequestService } from '@shared/services/request.service';
import { Router } from '@angular/router';
import { PriceService } from '@services/price.service';


@Component({
  selector: 'app-register-trip',
  templateUrl: './register-trip.component.html',
  styleUrls: ['./register-trip.component.css']
})
export class RegisterTripComponent implements OnInit {
  trip: Trip = {
    driverName: localStorage.getItem('currentDriverName') || '',
    driverNIF: localStorage.getItem('currentDriverNIF') || '',
    clientNIF: '',
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

  onSubmit(): void {
    const driverName = this.trip.driverName;
    const driverNIF = localStorage.getItem('currentDriverNIF') || '';
    const newStart = new Date(this.trip.startTime);
    const newEnd = new Date(this.trip.endTime);

    console.log('🚗 driverNIF:', driverNIF);

    this.tripService.getTripsByDriver(driverName).subscribe({
      next: (existingTrips) => {

        // ✅ 计算 sequenceNumber
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

        // 第二步：验证是否在 turno 时间段内
        this.turnService.getTurnsByDriver(driverNIF).subscribe({
          next: (turnos) => {
            console.log('📋 turnos recebidos:', turnos);
            const inTurno = turnos.some(t => {
              const s = new Date(t.startTime).getTime();
              const e = new Date(t.endTime).getTime();
              return newStart.getTime() >= s && newEnd.getTime() <= e;
            });

            if (!inTurno) {
              alert('❌ A viagem está fora do horário de turno do motorista.');
              return;
            }

            this.tripService.createTrip(this.trip).subscribe({
              next: () => {
                alert('✅ Viagem registada com sucesso!');
                
                // ✅ 标记 request 为 done（保持原有逻辑）
                const latestRequest = localStorage.getItem('latestRequest');
                if (latestRequest) {
                  const req = JSON.parse(latestRequest);
                  this.requestService.markRequestDone(req._id).subscribe({
                    next: () => console.log('🚫 Pedido marcado como concluído.'),
                    error: err => console.warn('⚠️ Falha ao marcar pedido como concluído:', err)
                  });
                }
            
                // ✅ 先清除缓存
                localStorage.removeItem('latestRequest');

                // ✅ 再跳转刷新 dashboard
                this.router.navigate(['/driver/dashboard']);
                
                this.resetForm();
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
  }

  resetForm(): void {
    this.trip = {
      driverName: localStorage.getItem('currentDriverName') || '',
      driverNIF: localStorage.getItem('currentDriverNIF') || '',
      clientNIF: '',
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

  ngOnInit(): void {
    const latestRequest = localStorage.getItem('latestRequest');
    if (!latestRequest) return;
  
    const cached = JSON.parse(latestRequest);
  
    // ⛔ 只用 localStorage 不准，主动向服务器查一次状态
    this.requestService.getRequestStatus(cached._id).subscribe(fresh => {
      if (!fresh.confirmedByClient) {
        alert('⚠️ O cliente ainda não confirmou a viagem.');
        this.router.navigate(['/driver/dashboard']);
        return;
      }
  
      // ✅ 使用 fresh 数据填充 trip 信息
      this.trip.clientNIF = fresh.nif;
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
  }
  
  
  calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return +(R * c).toFixed(2);  // 保留两位小数
  }
  
  toRad(value: number): number {
    return value * Math.PI / 180;
  }

  get formattedStartTime(): string {
    return this.formatDate(this.trip.startTime);
  }
  
  set formattedStartTime(value: string) {
    this.trip.startTime = new Date(value);
    this.estimatePrice();
  }
  
  get formattedEndTime(): string {
    return this.formatDate(this.trip.endTime);
  }
  
  set formattedEndTime(value: string) {
    this.trip.endTime = new Date(value);
    this.estimatePrice();
  }
  
  private formatDate(date: Date): string {
    const offset = date.getTimezoneOffset(); // 时区偏移（分钟）
    const localDate = new Date(date.getTime() - offset * 60000); // 转成本地时间
    return localDate.toISOString().slice(0, 16); // yyyy-MM-ddTHH:mm
  }
  
  
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
  
}
