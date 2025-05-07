/**
 * 📄 DriverReportModule
 *
 * 本模块负责管理司机(Driver)、出租车(Taxi)及旅程(Trip)的统计功能，
 * 包括汇总统计页面与各个详细列表页面。
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// 🚦 子路由模块
import { DriverReportRoutingModule } from './driver-report-routing.module';

// 🧩 本模块内组件
import { ReportDashboardComponent } from './report-dashboard/report-dashboard.component';
import { DriverDetailComponent } from './driver-page/driver-detail/driver-detail.component';
import { TaxiDetailComponent } from './taxi-page/taxi-detail/taxi-detail.component';
import { TripDetailComponent } from './trip-detail/trip-detail.component';
import { DriverListComponent } from './driver-page/driver-list/driver-list.component';
import { TaxiListComponent } from './taxi-page/taxi-list/taxi-list.component';

// 📦 UI组件
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    ReportDashboardComponent,
    DriverDetailComponent,
    TaxiDetailComponent,
    TripDetailComponent,
    DriverListComponent,
    TaxiListComponent
  ],
  imports: [
    CommonModule,
    DriverReportRoutingModule,
    FormsModule,
    MatButtonModule
  ]
})
export class DriverReportModule {}
