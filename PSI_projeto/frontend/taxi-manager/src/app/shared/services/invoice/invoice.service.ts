/**
 * 🧾 InvoiceService
 *
 * 本服务负责与后端 /api/invoices 接口通讯，
 * 实现发票 (Invoice) 的数据创建、查询等功能。
 *
 * 对应后端: invoice.routes.js
 * 使用场景: Trip完成后生成发票、查看发票列表、查看发票详情等。
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Invoice } from '@models/invoice.model';

@Injectable({ providedIn: 'root' })
export class InvoiceService {
  private apiUrl = 'http://localhost:3000/api/invoices';

  constructor(private http: HttpClient) {}

  /**
   * 📝 创建新发票
   * @param invoice 要创建的发票数据
   * @returns 创建成功后的发票对象
   */
  createInvoice(invoice: Invoice): Observable<Invoice> {
    return this.http.post<Invoice>(this.apiUrl, invoice);
  }

  /**
   * 📋 根据司机名查询发票列表
   * @param driverName 司机名称
   * @returns 该司机名下所有发票
   */
  getInvoicesByDriver(driverName: string): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.apiUrl}?driverName=${driverName}`);
  }

  /**
   * 📋 获取所有发票列表
   * @returns 所有发票（不筛选司机）
   */
  getInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(this.apiUrl);
  }

  /**
   * 📄 根据发票ID查询单张发票
   * @param invoiceId 发票ID (_id)
   * @returns 指定发票对象
   */
  getInvoiceById(invoiceId: string): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.apiUrl}/${invoiceId}`);
  }
}
