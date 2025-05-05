/**
 * 📦 TurnModule
 *
 * 本模块属于 Driver 部分，
 * 负责司机 (Driver) 的 Turn(班次)管理功能，
 * 包括创建新 Turn 和查看已有 Turn 列表。
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// 🧭 子路由配置
import { TurnRoutingModule } from './turn-routing.module';

// 🧩 页面组件
import { CreateTurnComponent } from './create-turn/create-turn.component';
import { TurnListComponent } from './turn-list/turn-list.component';

// 🛠️ UI组件库
import { MatButtonModule } from '@angular/material/button';

// 📦 共享模块
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [
    CreateTurnComponent,
    TurnListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TurnRoutingModule,
    MatButtonModule,
    SharedModule
  ]
})
export class TurnModule { }
