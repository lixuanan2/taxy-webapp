import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '@services/invoice.service';
import { Invoice } from '@models/invoice.model';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.css']
})
export class InvoiceListComponent implements OnInit {
  invoices: Invoice[] = [];

  constructor(private invoiceService: InvoiceService) {}

  ngOnInit(): void {
    this.loadInvoices();
  }

  loadInvoices(): void {
    this.invoiceService.getInvoices().subscribe({
      next: (invoices) => {
        this.invoices = invoices; // 将获取到的发票数据赋值给列表
      },
      error: (err) => {
        console.error('❌ Erro ao carregar faturas:', err);
      }
    });
  }
}
