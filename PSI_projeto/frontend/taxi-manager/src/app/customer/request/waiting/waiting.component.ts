import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RequestService } from '@services/request.service';
import { RideRequest } from '@models/ride-request.model';

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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.requestId = localStorage.getItem('currentRequestId');

    if (!this.requestId) {
      alert('❌ Pedido inválido. Redirecionando...');
      this.router.navigate(['/customer/dashboard']);
      return;
    }

    // ✅ 开始轮询状态
    this.pollingInterval = setInterval(() => {
      this.requestService.getRequestStatus(this.requestId!).subscribe({
        next: (request: RideRequest) => {
          console.log('📡 Pedido:', request.status);
    
          if (request.status === 'accepted') {
            clearInterval(this.pollingInterval);

            // 记录 request 信息（用于旅程注册页使用）
            localStorage.setItem('latestRequest', JSON.stringify(request));
    
            // 弹出详情对话框
            this.driverName = request.driverId || 'Desconhecido';
            this.driverDistance = null;     // 预留
            this.driverEta = null;
            this.driverPrice = null;
            this.taxiInfo = null;
            this.showDriverDialog = true;
    
          } else if (request.status === 'rejected') {
            alert('❌ O motorista recusou o pedido.');
            clearInterval(this.pollingInterval);
            this.router.navigate(['/customer/dashboard']);
    
          } else if (request.status === 'cancelled') {
            alert('⚠️ Pedido cancelado pelo sistema.');
            clearInterval(this.pollingInterval);
            this.router.navigate(['/customer/dashboard']);
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
  
}
