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
            alert('✅ Motorista encontrado!');
            clearInterval(this.pollingInterval);
            this.router.navigate(['/customer/dashboard']);
          }
          if (request.status === 'rejected') {
            alert('❌ O motorista recusou o pedido.');
            this.router.navigate(['/customer/dashboard']);
          } else if (request.status === 'cancelled') {
            alert('⚠️ Pedido cancelado pelo sistema.');
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
}
