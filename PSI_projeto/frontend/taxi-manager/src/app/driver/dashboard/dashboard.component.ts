import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '@services/invoice.service';
import { DriverAuthService } from '@services/driver-auth.service';
import { Router } from '@angular/router';
import { RequestService } from '@services/request.service';

@Component({
  selector: 'app-driver-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  driverName = localStorage.getItem('currentDriverName') || '';
  hasPendingTrip = false; // Determine if there are any pending trips
  invoicesCount: number = 0; // To hold the count of invoices issued

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
    this.invoiceService.getInvoices().subscribe({
      next: invoices => {
        this.invoicesCount = invoices.length;
      },
      error: err => {
        console.error('❌ Erro ao carregar faturas:', err);
      }
    });
  }
  
}
