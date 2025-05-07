/**
 * 📄 CustomerReportModule
 *
 * 本模块负责管理客户统计(Customer Report)相关功能，
 * 包括客户汇总、客户列表、客户详细旅程查看。
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// 🚦 子路由模块
import { CustomerReportRoutingModule } from './customer-report-routing.module';

// 🧩 本模块内组件
import { CustomerReportDashboardComponent } from './report-dashboard/report-dashboard.component';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerTripDetailComponent } from './customer-trip-detail/customer-trip-detail.component';

// 📦 UI 组件
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    CustomerReportDashboardComponent,
    CustomerDetailComponent,
    CustomerListComponent,
    CustomerTripDetailComponent
  ],
  imports: [
    CommonModule,
    CustomerReportRoutingModule,
    FormsModule,
    MatButtonModule
  ]
})
export class CustomerReportModule {}
