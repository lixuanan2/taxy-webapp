import { Component, OnInit } from '@angular/core';
import { TripService } from '@services/trip.service';
import { InvoiceService } from '@services/invoice.service';
import { Trip } from '@models/trip.model';

@Component({
  selector: 'app-issue-invoice',
  templateUrl: './issue-invoice.component.html',
  styleUrls: ['./issue-invoice.component.css']
})
export class IssueInvoiceComponent implements OnInit {
  driverName = localStorage.getItem('currentDriverName') || '';
  trips: Trip[] = [];

  constructor(
    private tripService: TripService,
    private invoiceService: InvoiceService
  ) {}

  ngOnInit(): void {
    this.loadTrips();  // 只调用一次，加载旅程
  }

  issue(trip: Trip): void {
    const invoice = {
      tripId: trip._id!,
      driverName: trip.driverName,
      clientNIF: trip.clientNIF,
      total: trip.price,
      date: new Date().toISOString()  // 日期格式需要改为 string
    };

    // 调用服务生成发票
    this.invoiceService.createInvoice(invoice).subscribe({
      next: () => {
        alert('✅ Fatura emitida com sucesso!');
        // 刷新 trip 列表，移除已经开票的 trip
        this.loadTrips();
      },
      error: err => {
        alert('❌ Erro ao emitir fatura.');
        console.error(err);
      }
    });
  }

  // 加载旅程并确保只显示未开票的旅程
  loadTrips(): void {
    this.tripService.getTripsByDriver(this.driverName).subscribe({
      next: trips => {
        // 只保留未开票的旅程
        this.trips = trips.filter(t => !t.invoiceId);
      },
      error: err => console.error('❌ Erro ao carregar viagens:', err)
    });
  }
}
