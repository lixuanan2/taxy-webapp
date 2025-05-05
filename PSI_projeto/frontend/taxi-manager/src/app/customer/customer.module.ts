/**
 * 📦 CustomerModule
 *
 * 本模块管理客户（Customer）端相关页面与功能，
 * 包括 Dashboard 首页和懒加载子模块（Request）。
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// 🚦 子路由配置
import { CustomerRoutingModule } from './customer-routing.module';

// 🧩 页面组件
import { DashboardComponent } from './dashboard/dashboard.component';

// 📦 共享模块
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    SharedModule
  ]
})
export class CustomerModule {}
