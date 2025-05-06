/**
 * 🧾 InvoiceListComponent
 *
 * 本组件属于 Driver 模块，
 * 用于展示当前司机所有已开具发票 (Invoice) 的旅程 (Trip),
 * 并支持漏开的旅程直接开票。
 */

import { Component, OnInit } from '@angular/core';
import { TripService } from '@shared/services/trip/trip.service';
import { InvoiceService } from '@shared/services/invoice/invoice.service';
import { Trip } from '@models/trip.model';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.css']
})
export class InvoiceListComponent implements OnInit {
  // 📋 当前司机所有有发票的旅程
  trips: Trip[] = [];

  constructor(
    private tripService: TripService,
    private invoiceService: InvoiceService
  ) {}

  ngOnInit(): void {
    this.loadTrips(); // 页面初始化加载旅程
  }

  /**
   * 🧾 为旅程补开发票
   * @param trip 选中的旅程
   */
  issue(trip: Trip): void {
    const invoice = {
      tripId: trip._id!,
      driverName: trip.driverName,
      clientNIF: trip.clientNIF,
      total: trip.price,
      date: new Date().toISOString()
    };

    this.invoiceService.createInvoice(invoice).subscribe({
      next: () => {
        alert('✅ Fatura emitida com sucesso!');
        this.loadTrips(); // 成功后刷新旅程列表
      },
      error: err => {
        alert('❌ Error issuing invoice.');
        console.error(err);
      }
    });
  }

  /**
   * 📋 加载司机的所有有发票的旅程
   */
  loadTrips(): void {
    const driverName = localStorage.getItem('currentDriverName') || '';
    this.tripService.getTripsByDriver(driverName).subscribe({
      next: trips => {
        this.trips = trips.filter(t => t.invoiceId);
      },
      error: err => console.error('❌ Error loading trips with invoices:', err)
    });
  }
}
