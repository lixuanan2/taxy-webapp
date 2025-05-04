/**
 * 📄 ManagerModule
 *
 * 本模块负责组织 Manager 端的页面与功能，
 * 包括主控制台与各管理子模块（出租车、司机、价格、报表等）。
 *
 * 依赖：
 * - CommonModule (基础指令)
 * - SharedModule (项目共享模块)
 * - ManagerRoutingModule (子路由)
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// 🛣️ 子路由模块
import { ManagerRoutingModule } from './manager-routing.module';

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
    ManagerRoutingModule,
    SharedModule
  ]
})
export class ManagerModule {}
