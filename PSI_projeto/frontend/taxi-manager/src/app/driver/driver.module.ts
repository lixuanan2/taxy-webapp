/**
 * 📄 DriverModule
 *
 * 本模块负责组织 Driver 端的页面与功能，
 * 包括登录、控制台、请求列表等子模块页面。
 *
 * 依赖：
 * - Angular FormsModule (表单处理)
 * - Angular Material 按钮模块
 * - DriverRoutingModule (子路由)
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// 🛣️ 子路由模块
import { DriverRoutingModule } from './driver-routing.module';

// 🧩 页面组件
import { DriverLoginComponent } from './login/login.component';
import { DashboardComponent } from '@driver/dashboard/dashboard.component';
import { RequestListComponent } from './request-list/request-list.component';

// 🎨 UI组件
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    DriverLoginComponent,
    DashboardComponent,
    RequestListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    DriverRoutingModule,
    MatButtonModule
  ]
})
export class DriverModule {}
