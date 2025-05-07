/**
 * 📄 DriverReportRoutingModule
 *
 * 本模块定义司机与出租车统计(Driver & Taxi Report)模块内部子路由，
 * 包括查看司机汇总、出租车汇总、旅程明细和各自的详细页面。
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// 🧩 组件导入
import { ReportDashboardComponent } from './report-dashboard/report-dashboard.component';
import { DriverDetailComponent } from './driver-page/driver-detail/driver-detail.component';
import { TaxiDetailComponent } from './taxi-page/taxi-detail/taxi-detail.component';
import { TripDetailComponent } from './trip-detail/trip-detail.component';
import { DriverListComponent } from './driver-page/driver-list/driver-list.component';
import { TaxiListComponent } from './taxi-page/taxi-list/taxi-list.component';

// 🌟 Driver Report 模块子路由配置
const routes: Routes = [
  { path: '', component: ReportDashboardComponent },
  { path: 'trip', component: TripDetailComponent },
  { path: 'driver-list', component: DriverListComponent },
  { path: 'taxi-list', component: TaxiListComponent },
  { path: 'driver/:name', component: DriverDetailComponent },
  { path: 'taxi/:plate', component: TaxiDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriverReportRoutingModule {}
