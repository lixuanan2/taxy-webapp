import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RequestService } from '@services/request.service';
import { RideRequest } from '@models/ride-request.model';
import { PriceService } from '@services/price.service';
import { PriceConfig } from '@models/price.model';

@Component({
  selector: 'app-request-waiting',
  templateUrl: './waiting.component.html',
  styleUrls: ['./waiting.component.css']
})
export class WaitingComponent implements OnInit, OnDestroy {
  requestId: string | null = null;
  pollingInterval: any;

  // driver 接收后信息
  driverId = "";
  showDriverDialog = false;
  driverName = '';
  driverDistance: string | null = null;
  driverEta: string | null = null;
  driverPrice: string | null = null;
  taxiInfo: string | null = null;

  constructor(
    private requestService: RequestService,
    private router: Router,
    private priceService: PriceService
  ) {}

  priceConfig: PriceConfig = {
    basic: 0.25,
    luxury: 0.35,
    nightBonus: 20
  };

  ngOnInit(): void {
    this.requestId = localStorage.getItem('currentRequestId');

    if (!this.requestId) {
      alert('❌ Pedido inválido. Redirecionando...');
      this.router.navigate(['/customer/dashboard']);
      return;
    }

    this.priceService.getLatestPrice().subscribe({
      next: data => {
        if (data) this.priceConfig = data;
      },
      error: err => console.warn('⚠️ Falha ao carregar preço do backend:', err)
    });

    // ✅ 开始轮询状态
    this.pollingInterval = setInterval(() => {
      this.requestService.getRequestStatus(this.requestId!).subscribe({
        next: (request: RideRequest) => {
          console.log('📡 Pedido:', request.status);
    
          if (request.status === 'accepted') {
            clearInterval(this.pollingInterval);
            localStorage.setItem('latestRequest', JSON.stringify(request));
          
            // 👉 读取 request 中的真实坐标
            const customerLat = request.currentLat;
            const customerLon = request.currentLon;
            const destLat = request.destLat;
            const destLon = request.destLon;
          
            // 👉 模拟司机位置（后续可换成 request.driverLat 等）
            const driverLat = 38.7223;
            const driverLon = -9.1393;
          
            const distanceToClient = this.calculateDistanceKm(driverLat, driverLon, customerLat, customerLon);
            const distanceToDestination = this.calculateDistanceKm(customerLat, customerLon, destLat, destLon);
          
            const etaMinutes = Math.round(distanceToClient * 4);
            const tripMinutes = Math.round(distanceToDestination * 4);
          
            const now = new Date();
            const tripStart = new Date(now.getTime() + etaMinutes * 60000);
            const hour = tripStart.getHours();
            const isNight = hour >= 21 || hour < 6;
          
            // 👇 加载价格配置（推荐：添加 PriceService）
            const baseRate = this.priceConfig.basic;  // 可根据舒适等级动态调整
            const nightBonus = this.priceConfig.nightBonus;

          
            const rate = isNight ? baseRate * (1 + nightBonus / 100) : baseRate;
            const estimatedPrice = +(tripMinutes * rate).toFixed(2);
          
            // ✅ 展示
            this.driverName = request.driverId || 'Desconhecido';
            this.driverDistance = `${distanceToClient.toFixed(2)} km`;
            this.driverEta = `${etaMinutes} min`;
            this.driverPrice = `€${estimatedPrice.toFixed(2)}`;
            this.taxiInfo = `Duração estimada: ${tripMinutes} min`;
          
            this.showDriverDialog = true;
          }
          
        },
        error: err => {
          console.error('Erro na verificação:', err);
        }
      });
    }, 3000);
    
  }

  cancelRequest(): void {
    if (this.requestId) {
      this.requestService.cancelRequest(this.requestId).subscribe(() => {
        alert('❌ Pedido cancelado com sucesso.');
        clearInterval(this.pollingInterval);
        this.router.navigate(['/customer/dashboard']);
      });
    }
  }

  ngOnDestroy(): void {
    // 🧹 清理定时器
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
  }

  onDriverAccepted(): void {
    alert('✅ Motorista aceito! Redirecionando...');
    this.router.navigate(['/customer/dashboard']);
  }

  onDriverRejected(): void {
    alert('❌ Motorista rejeitado. Continuando a procurar...');
    this.showDriverDialog = false;
    // 可选：重新启动轮询（如果你希望客户还能等下一个司机）
  }
  
  calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // 地球半径 km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
  
  toRad(value: number): number {
    return value * Math.PI / 180;
  }
  
}
