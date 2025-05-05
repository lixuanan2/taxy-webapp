/**
 * 🧭 TurnRoutingModule
 *
 * 本模块负责配置 Turn 功能的子路由，
 * 包括司机(Driver)创建新 Turn 和查看已有 Turn 列表的页面跳转。
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// 🧩 页面组件
import { CreateTurnComponent } from './create-turn/create-turn.component';
import { TurnListComponent } from './turn-list/turn-list.component';

// 🚦 路由定义
const routes: Routes = [
  { path: 'create', component: CreateTurnComponent }, // 创建新 Turn
  { path: 'list', component: TurnListComponent }       // 查看 Turn 列表
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TurnRoutingModule {}
