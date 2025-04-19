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
    this.requestService.getAcceptedRequest(driverName).subscribe({
      next: (req) => {
        this.hasPendingTrip = !!req;
      },
      error: err => {
        console.warn('⚠️ Falha ao verificar pedidos aceites:', err);
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
