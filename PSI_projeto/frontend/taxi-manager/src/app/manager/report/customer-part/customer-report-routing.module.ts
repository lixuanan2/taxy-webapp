/**
 * 📄 CustomerReportRoutingModule
 *
 * 本模块定义客户统计(Customer Report)模块的内部路由，
 * 包括查看客户汇总、客户列表、客户详情和全部旅程。
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// 🧩 组件导入
import { CustomerReportDashboardComponent } from './report-dashboard/report-dashboard.component';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerTripDetailComponent } from './customer-trip-detail/customer-trip-detail.component';

// 🌟 客户统计模块子路由配置
const routes: Routes = [
  { path: '', component: CustomerReportDashboardComponent },
  { path: 'trip', component: CustomerTripDetailComponent },
  { path: 'customer-list', component: CustomerListComponent },
  { path: 'customer-detail/:nif', component: CustomerDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerReportRoutingModule {}
