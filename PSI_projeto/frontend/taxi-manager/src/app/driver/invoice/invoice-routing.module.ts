/**
 * 📄 InvoiceRoutingModule
 *
 * 本模块定义 Driver ➔ Invoice 区域的路由规则，包括：
 * - IssueInvoice 页面 (Story 9: 开具发票)
 * - InvoiceList 页面 (Story 9: 查看发票列表)
 * - InvoiceDetail 页面 (Story 9: 查看发票详情)
 *
 * 使用子路由 (forChild) 注册到 Driver 主模块。
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// 🧾 发票子模块组件
import { IssueInvoiceComponent } from '@driver/invoice/issue-invoice/issue-invoice.component';
import { InvoiceListComponent } from '@driver/invoice/invoice-list/invoice-list.component';
import { InvoiceDetailComponent } from './invoice-detail/invoice-detail.component';

// 🛣️ 路由配置
const routes: Routes = [
  { path: 'issue', component: IssueInvoiceComponent },       // 创建发票页面
  { path: 'list', component: InvoiceListComponent },         // 发票列表页面
  { path: 'detail/:id', component: InvoiceDetailComponent }, // 发票详情页面
  { path: '', redirectTo: 'list', pathMatch: 'full' }         // 默认重定向到发票列表
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoiceRoutingModule {}
