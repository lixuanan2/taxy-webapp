/**
 * 🧾 InvoiceDetailComponent
 *
 * 本组件属于 Driver 模块，
 * 用于查看单张发票 (Invoice) 的详细信息。
 *
 * 功能：
 * - 根据 URL 中的 id 加载指定发票
 * - 展示发票的编号、客户、司机、总价、日期、关联旅程ID
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InvoiceService } from '@shared/services/invoice/invoice.service';
import { Invoice } from '@models/invoice.model';

@Component({
  selector: 'app-invoice-detail',
  templateUrl: './invoice-detail.component.html',
  styleUrls: ['./invoice-detail.component.css']
})
export class InvoiceDetailComponent implements OnInit {
  // 📋 当前发票对象
  invoice: Invoice | null = null;

  // 🆔 当前发票ID (URL参数)
  invoiceId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private invoiceService: InvoiceService
  ) {}

  ngOnInit(): void {
    this.invoiceId = this.route.snapshot.paramMap.get('id');

    if (this.invoiceId) {
      this.invoiceService.getInvoiceById(this.invoiceId).subscribe({
        next: (invoice: Invoice) => {
          this.invoice = invoice;
        },
        error: (err) => {
          console.error('❌ Error loading invoice details', err);
        }
      });
    }
  }
}
