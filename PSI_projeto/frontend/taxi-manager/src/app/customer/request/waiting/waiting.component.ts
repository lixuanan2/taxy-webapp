// 📄 WaitingComponent - 客户端等待司机接单

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RequestService } from '@shared/services/request/request.service';
import { RideRequest } from '@models/ride-request.model';
import { PriceService } from '@shared/services/price/price.service';
import { PriceConfig } from '@models/price.model';

@Component({
  selector: 'app-request-waiting',
  templateUrl: './waiting.component.html',
  styleUrls: ['./waiting.component.css']
})
export class WaitingComponent implements OnInit, OnDestroy {
  requestId: string | null = null;
  pollingInterval: any;

  // 🚖 司机确认弹窗参数
  driverId = '';
  showDriverDialog = false;
  driverName = '';
  driverDistance: string | null = null;
  driverEta: string | null = null;
  driverPrice: string | null = null;
  taxiInfo: string | null = null;

  priceConfig: PriceConfig = {
    basic: 0.25,
    luxury: 0.35,
    nightBonus: 20
  };

  constructor(
    private requestService: RequestService,
    private router: Router,
    private priceService: PriceService
  ) {}

  // ====================== //
  // 🎯 生命周期钩子：初始化
  // ====================== //
  ngOnInit(): void {
    this.requestId = localStorage.getItem('currentRequestId');

    if (!this.requestId) {
      alert('❌ Invalid request. Redirecting...');
      this.router.navigate(['/customer/dashboard']);
      return;
    }

    // 加载最新价格配置
    this.priceService.getLatestPrice().subscribe({
      next: data => {
        if (data) this.priceConfig = data;
      },
      error: err => console.warn('⚠️ Failed to load price config from backend:', err)
    });

    // ✅ 开始轮询请求状态
    this.pollingInterval = setInterval(() => {
      this.requestService.getRequestStatus(this.requestId!).subscribe({
        next: (request: RideRequest) => {
          console.log('📡 Request status:', request.status);

          if (request.status === 'accepted') {
            clearInterval(this.pollingInterval);
            localStorage.setItem('latestRequest', JSON.stringify(request));

            this.handleAcceptedRequest(request);
          }
        },
        error: err => {
          console.error('❌ Error while polling request:', err);
        }
      });
    }, 3000);
  }

  // ====================== //
  // 🎯 生命周期钩子：销毁
  // ====================== //
  ngOnDestroy(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
  }

  // ====================== //
  // 🛑 取消请求
  // ====================== //
  cancelRequest(): void {
    if (this.requestId) {
      this.requestService.cancelRequest(this.requestId).subscribe(() => {
        alert('❌ Request canceled successfully.');
        clearInterval(this.pollingInterval);
        this.router.navigate(['/customer/dashboard']);
      });
    }
  }

  // ====================== //
  // 📦 处理已接受的请求
  // ====================== //
  handleAcceptedRequest(request: RideRequest): void {
    // 📍 获取客户、司机、目的地的坐标
    const customerLat = request.currentLat;
    const customerLon = request.currentLon;
    const destLat = request.destLat;
    const destLon = request.destLon;
    const driverLat = 38.7223;   // 🔥 临时模拟
    const driverLon = -9.1393;

    // 📏 计算距离与时间
    const distanceToClient = this.calculateDistanceKm(driverLat, driverLon, customerLat, customerLon);
    const distanceToDestination = this.calculateDistanceKm(customerLat, customerLon, destLat, destLon);

    const etaMinutes = Math.round(distanceToClient * 4);
    const tripMinutes = Math.round(distanceToDestination * 4);

    const now = new Date();
    const tripStart = new Date(now.getTime() + etaMinutes * 60000);
    const hour = tripStart.getHours();
    const isNight = hour >= 21 || hour < 6;

    // 💰 估算价格
    const baseRate = this.priceConfig.basic;
    const nightBonus = this.priceConfig.nightBonus;
    const rate = isNight ? baseRate * (1 + nightBonus / 100) : baseRate;
    const estimatedPrice = +(tripMinutes * rate).toFixed(2);

    // ✅ 设置弹窗数据
    this.driverName = request.driverId || 'Unknown';
    this.driverDistance = `${distanceToClient.toFixed(2)} km`;
    this.driverEta = `${etaMinutes} min`;
    this.driverPrice = `€${estimatedPrice.toFixed(2)}`;
    this.taxiInfo = `Estimated duration: ${tripMinutes} min`;

    this.showDriverDialog = true;
  }

  // ====================== //
  // 🧮 工具方法：计算地理距离 (Haversine公式)
  // ====================== //
  calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // 地球半径 (公里)
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // 📐 度数转弧度
  toRad(value: number): number {
    return value * Math.PI / 180;
  }

  // ====================== //
  // ✅ 接受司机
  // ====================== //
  onDriverAccepted(): void {
    if (!this.requestId) return;

    this.requestService.confirmRequest(this.requestId).subscribe({
      next: () => {
        alert('✅ Driver accepted! Redirecting...');
        this.router.navigate(['/customer/dashboard']);
      },
      error: err => {
        console.error('❌ Failed to confirm driver:', err);
        alert('Error confirming driver.');
      }
    });
  }

  // ====================== //
  // ❌ 顾客点击拒绝司机
  // ====================== //
  onDriverRejected(): void {
    if (!this.requestId) return;

    this.requestService.cancelRequest(this.requestId).subscribe({
      next: () => {
        alert('🚫 You rejected the driver. Request canceled.');
        this.router.navigate(['/customer/dashboard']);
      },
      error: err => {
        console.error('❌ Failed to cancel request after rejecting driver:', err);
        alert('Error canceling request.');
      }
    });
  }

}
