import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '@services/invoice.service';

@Component({
  selector: 'app-driver-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  driverName = localStorage.getItem('currentDriverName') || '';
  hasPendingTrip = false; // Determine if there are any pending trips
  invoicesCount: number = 0; // To hold the count of invoices issued

  constructor(private invoiceService: InvoiceService) {}

  ngOnInit(): void {
    // Fetch the number of invoices for this driver
    this.invoiceService.getInvoices().subscribe({
      next: invoices => {
        this.invoicesCount = invoices.length; // Update invoice count
      },
      error: err => console.error('❌ Erro ao carregar faturas:', err)
    });

    // Add logic to check if the driver has pending trips (you may already have this logic in your code)
    // this.checkPendingTrips();
  }

  // Method to check if there are pending trips that need to be registered
  checkPendingTrips() {
    // Logic to determine if there are pending trips (you may already have this in your current code)
    this.hasPendingTrip = true; // Just for demonstration purposes
  }
}
