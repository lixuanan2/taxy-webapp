/**
 * 🛣️ TripRoutingModule
 *
 * 本模块负责配置 Trip(旅程) 子模块的路由，
 * 包括注册旅程页面(RegisterTripComponent)和旅程列表页面(TripListComponent)。
 *
 * 使用场景: Driver 模块 - Trip 子路由管理
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// 📄 组件导入
import { RegisterTripComponent } from './register-trip/register-trip.component';
import { TripListComponent } from './trip-list/trip-list.component';

// 📋 路由定义
const routes: Routes = [
  { path: 'register', component: RegisterTripComponent }, // ➡️ 旅程登记
  { path: 'list', component: TripListComponent },         // ➡️ 旅程列表
  { path: '', redirectTo: 'list', pathMatch: 'full' }      // ➡️ 默认跳转到列表页
];

@NgModule({
  imports: [RouterModule.forChild(routes)], // 🔗 注册子模块路由
  exports: [RouterModule]                   // 🔄 导出供 TripModule 使用
})
export class TripRoutingModule { }
