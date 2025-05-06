/**
 * 📦 TripModule
 *
 * 本模块负责 Trip(旅程) 相关功能，
 * 包含旅程登记(Register Trip)与旅程列表(Trip List)页面，
 * 并引入了共享模块(SharedModule)、表单模块(FormsModule)等依赖。
 *
 * 使用场景: Driver 模块 - Trip 登记与管理
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// 🛣️ Trip 子路由
import { TripRoutingModule } from './trip-routing.module';

// 📄 组件导入
import { TripListComponent } from './trip-list/trip-list.component';
import { RegisterTripComponent } from './register-trip/register-trip.component';

// 📋 表单与按钮模块
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

// 🔄 引入 SharedModule(共享管道、组件)
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [
    // 🧩 本模块组件
    RegisterTripComponent,
    TripListComponent,
  ],
  imports: [
    CommonModule,
    TripRoutingModule,
    FormsModule,
    MatButtonModule,
    SharedModule
  ]
})
export class TripModule { }
