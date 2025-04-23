import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '@shared/services/invoice/invoice.service';
import { DriverAuthService } from '@shared/services/driver-auth/driver-auth.service';
import { Router } from '@angular/router';
import { RequestService } from '@shared/services/request/request.service';

@Component({
  selector: 'app-driver-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  driverName = localStorage.getItem('currentDriverName') || '';
  hasPendingTrip = false; // Determine if there are any pending trips
  invoicesCount: number = 0; // To hold the count of invoices issued

  waitingForClient = false;
  rejectedByClient = false;

  constructor(
    private requestService: RequestService,
    private invoiceService: InvoiceService,
    private authService: DriverAuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkForPendingTrip();
    // Fetch the number of invoices for this driver
    this.loadInvoices();

    // 如果刚刚接受了请求，则启动轮询
    const pendingId = localStorage.getItem('latestRequestId');
    if (pendingId) {
      this.waitingForClient = true;
      this.waitForClientConfirmation(pendingId);
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/driver/login']);
  }

  checkForPendingTrip() {
    const driverName = localStorage.getItem('currentDriverName') || '';
    const latestRequest = localStorage.getItem('latestRequest');
  
    if (!latestRequest) {
      this.hasPendingTrip = false;
      return;
    }
  
    const req = JSON.parse(latestRequest);
  
    this.requestService.getRequestStatus(req._id).subscribe({
      next: fresh => {
        if (fresh.status === 'rejected' || fresh.status === 'cancelled' || fresh.status === 'done') {
          // ❌ 被拒绝、取消或已完成 → 清除 localStorage 并隐藏提示
          localStorage.removeItem('latestRequest');
          this.hasPendingTrip = false;
          return;
        }
  
        if (fresh.status === 'accepted' && fresh.confirmedByClient) {
          // ✅ 已接受且客户确认
          this.hasPendingTrip = true;
        } else {
          // ⛔ 未确认，隐藏提示（你可以在这里弹 alert 提醒司机）
          this.hasPendingTrip = false;
        }
      },
      error: err => {
        console.warn('⚠️ Falha ao verificar pedidos aceites:', err);
        this.hasPendingTrip = false;
      }
    });
  }
  

  loadInvoices() {
    const driverName = localStorage.getItem('currentDriverName') || '';
    this.invoiceService.getInvoicesByDriver(driverName).subscribe({
      next: invoices => {
        this.invoicesCount = invoices.length;
      },
      error: err => {
        console.error('❌ Erro ao carregar faturas:', err);
      }
    });
  }  
  
  waitInterval: any;

  waitForClientConfirmation(requestId: string): void {
    this.waitInterval = setInterval(() => {
      this.requestService.getRequestStatus(requestId).subscribe({
        next: (fresh) => {
          if (fresh.status === 'rejected' || fresh.status === 'cancelled') {
            localStorage.removeItem('latestRequest');
            localStorage.removeItem('latestRequestId');
            this.rejectedByClient = true;         // ✅ 标记应该显示红框
            this.hasPendingTrip = false;
            this.waitingForClient = false;
          }
           else if (fresh.confirmedByClient) {
            clearInterval(this.waitInterval);
            this.hasPendingTrip = true;
            this.waitingForClient = false; // ⬅️ 添加
            localStorage.removeItem('latestRequestId');
          }
        },
        error: (err) => {
          console.error('Erro ao verificar confirmação do cliente:', err);
        
          if (err.status === 404) {
            clearInterval(this.waitInterval);
            localStorage.removeItem('latestRequestId');
            this.waitingForClient = false;
            // 可选：弹窗提示
            alert('❌ O pedido foi removido ou não existe mais.');
          }
        }
      });
    }, 3000);
  }

  dismissRejectionAlert(): void {
    this.rejectedByClient = false;
  }  
  
}
