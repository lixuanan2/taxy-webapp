import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Invoice } from '@models/invoice.model';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private apiUrl = 'http://localhost:3000/api/invoices';

  constructor(private http: HttpClient) {}

  // 创建发票
  createInvoice(invoice: Invoice): Observable<Invoice> {
    return this.http.post<Invoice>(this.apiUrl, invoice);
  }

  // 获取当前司机的发票列表（可用于 invoice-list）
  getInvoicesByDriver(driverName: string): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.apiUrl}?driverName=${driverName}`);
  }

  getInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(this.apiUrl); // 获取所有发票
  }
}


