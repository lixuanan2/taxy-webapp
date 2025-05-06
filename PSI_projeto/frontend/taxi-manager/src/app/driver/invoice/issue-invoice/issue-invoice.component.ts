/**
 * 🧾 IssueInvoiceComponent
 *
 * 本组件属于 Driver 模块，
 * 用于完成旅程 (Trip) 后，为客户 (Client) 开具发票 (Invoice)，包括:
 * - 显示所有尚未开具发票的旅程
 * - 点击按钮生成发票并提交到后端
 * - 刷新旅程列表
 */

import { Component, OnInit } from '@angular/core';
import { TripService } from '@shared/services/trip/trip.service';
import { InvoiceService } from '@shared/services/invoice/invoice.service';
import { Trip } from '@models/trip.model';

@Component({
  selector: 'app-issue-invoice',
  templateUrl: './issue-invoice.component.html',
  styleUrls: ['./issue-invoice.component.css']
})
export class IssueInvoiceComponent implements OnInit {
  // 🚕 当前司机名（从 localStorage 读取）
  driverName = localStorage.getItem('currentDriverName') || '';

  // 📋 当前司机所有未开票旅程
  trips: Trip[] = [];

  constructor(
    private tripService: TripService,
    private invoiceService: InvoiceService
  ) {}

  ngOnInit(): void {
    this.loadTrips(); // 页面初始化时加载旅程列表
  }

  /**
   * 🧾 创建发票并提交
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
        this.trips = this.trips.filter(t => t._id !== trip._id); // 移除已开票旅程
        this.loadTrips(); // 重新加载旅程
      },
      error: err => {
        alert('❌ Error issuing invoice.');
        console.error(err);
      }
    });
  }

  /**
   * 📋 加载未开票的旅程
   */
  loadTrips(): void {
    this.tripService.getTripsByDriver(this.driverName).subscribe({
      next: trips => {
        // 仅保留未关联发票的旅程
        this.trips = trips.filter(t => !t.invoiceId);
      },
      error: err => console.error('❌ Error loading trips:', err)
    });
  }
}
