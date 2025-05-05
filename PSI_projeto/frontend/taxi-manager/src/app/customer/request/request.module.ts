/**
 * 📦 RequestModule
 *
 * 本模块负责客户(Customer)端的叫车请求(Request)功能，
 * 包括：创建请求、等待响应、司机确认弹窗、查看历史记录。
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// 🚦 子路由模块
import { RequestRoutingModule } from './request-routing.module';

// 🧩 页面组件
import { RequestCreateComponent } from './create/request-create.component';
import { WaitingComponent } from './waiting/waiting.component';
import { HistoryComponent } from './history/history.component';

// 🖥️ 司机确认弹窗
import { DriverConfirmDialogComponent } from './driver-confirm-dialog/driver-confirm-dialog.component';

// 📦 共享模块
import { SharedModule } from '@shared/shared.module';

// 🎨 Material UI 组件
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    RequestCreateComponent,
    WaitingComponent,
    DriverConfirmDialogComponent,
    HistoryComponent
  ],
  imports: [
    CommonModule,
    RequestRoutingModule,
    FormsModule,
    SharedModule,
    MatButtonModule
  ]
})
export class RequestModule {}
