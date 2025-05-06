/**
 * 📄 InvoiceModule
 *
 * 本模块负责组织 Driver 端的发票相关功能页面，
 * 包括开具发票、查看发票列表与发票详情。
 *
 * 依赖：
 * - Angular FormsModule (表单处理)
 * - Angular Material 按钮模块 (MatButtonModule)
 * - InvoiceRoutingModule (发票子路由)
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// 🛣️ 子路由模块
import { InvoiceRoutingModule } from './invoice-routing.module';

// 🧩 页面组件
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { IssueInvoiceComponent } from './issue-invoice/issue-invoice.component';
import { InvoiceDetailComponent } from './invoice-detail/invoice-detail.component';

// 🎨 UI组件
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    InvoiceListComponent,
    IssueInvoiceComponent,
    InvoiceDetailComponent
  ],
  imports: [
    CommonModule,
    InvoiceRoutingModule,
    FormsModule,
    MatButtonModule
  ]
})
export class InvoiceModule { }
