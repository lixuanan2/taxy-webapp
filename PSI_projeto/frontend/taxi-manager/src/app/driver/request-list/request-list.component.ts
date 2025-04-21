import { Component, OnInit } from '@angular/core';
import { RequestService } from '@services/request.service';
import { RideRequest } from '@models/ride-request.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.css']
})
export class RequestListComponent implements OnInit {
  requests: RideRequest[] = [];
  loading = true;
  driverName = '';

  constructor(
    private requestService: RequestService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.driverName = localStorage.getItem('currentDriverName') || '';
    this.loadRequests();
  }

  loadRequests(): void {
    this.loading = true;
    this.requestService.getPendingRequests().subscribe({
      next: (data) => {
        // 只展示 status === 'pending' 且 driverId 为空 的请求
        this.requests = data.filter(r => r.status === 'pending' && !r.driverId);
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao buscar pedidos:', err);
        this.loading = false;
      }
    });
  }
  

  accept(requestId: string): void {
    if (!this.driverName) {
      alert('⚠️ Nome do motorista não disponível.');
      return;
    }
  
    this.requestService.acceptRequest(requestId, this.driverName).subscribe({
      next: () => {
        alert(`✅ Pedido aceito por ${this.driverName}!`);
        this.router.navigate(['/driver/dashboard']);
      },
      error: (err) => {
        alert('❌ Erro ao aceitar o pedido.');
        console.error(err);
      }
    });
  }

  reject(requestId: string): void {
    this.requestService.rejectRequest(requestId).subscribe({
      next: () => {
        alert('🚫 Pedido rejeitado.');
        this.loadRequests(); // 刷新列表
      },
      error: (err) => {
        alert('❌ Erro ao rejeitar o pedido.');
        console.error(err);
      }
    });
  }

  getEstimatedTime(req: RideRequest): string {
    if (!req.currentLat || !req.currentLon || !req.destLat || !req.destLon) return '—';
  
    const distanceKm = this.haversineKm(
      req.currentLat, req.currentLon,
      req.destLat, req.destLon
    );
  
    const speedKmh = 30; // 平均速度
    const timeMin = Math.round((distanceKm / speedKmh) * 60);
    return `${timeMin} min`;
  }
  
  haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // 地球半径 km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
  
  
}
