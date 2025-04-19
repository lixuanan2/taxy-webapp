import { Component, OnInit } from '@angular/core';
import { TripService } from '@services/trip.service';
import { InvoiceService } from '@services/invoice.service';
import { Trip } from '@models/trip.model';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.css']
})
export class InvoiceListComponent implements OnInit {
  trips: Trip[] = []; // 用于存储有发票的旅程
  
  constructor(
    private tripService: TripService,
    private invoiceService: InvoiceService
  ) {}

  ngOnInit(): void {
    // 获取所有有发票的旅程
    const driverName = localStorage.getItem('currentDriverName') || '';
    this.tripService.getTripsByDriver(driverName).subscribe({
      next: trips => {
        this.trips = trips.filter(t => t.invoiceId);  // 只保留已经有发票的旅程
      },
      error: err => console.error('❌ Erro ao carregar viagens com faturas:', err)
    });
  }

  issue(trip: Trip): void {
    const invoice = {
      tripId: trip._id!,
      driverName: trip.driverName,
      clientNIF: trip.clientNIF,
      total: trip.price,
      date: new Date().toISOString()
    };

    // 调用发票服务创建发票
    this.invoiceService.createInvoice(invoice).subscribe({
      next: () => {
        alert('✅ Fatura emitida com sucesso!');
        this.loadTrips(); // 更新旅程列表
      },
      error: err => {
        alert('❌ Erro ao emitir fatura.');
        console.error(err);
      }
    });
  }

  loadTrips(): void {
    const driverName = localStorage.getItem('currentDriverName') || '';
    this.tripService.getTripsByDriver(driverName).subscribe({
      next: trips => {
        this.trips = trips.filter(t => t.invoiceId);  // 刷新列表，保留已开票的旅程
      },
      error: err => console.error('❌ Erro ao carregar viagens com faturas:', err)
    });
  }
}
