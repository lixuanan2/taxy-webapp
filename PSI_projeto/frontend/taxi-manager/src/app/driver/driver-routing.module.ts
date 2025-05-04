/**
 * 📄 DriverRoutingModule
 *
 * 本模块定义 Driver 区域的路由规则，包括：
 * - 登录页
 * - 驾驶员控制台
 * - Turn (Story 5)
 * - RideRequest (Story 7)
 * - Trip (Story 8)
 * - Invoice (Story 9)
 *
 * 使用了懒加载(lazy loading)机制以优化性能。
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// 🧑‍✈️ 司机模块组件
import { DriverLoginComponent } from '@driver/login/login.component';
import { DashboardComponent } from '@driver/dashboard/dashboard.component';
import { RequestListComponent } from './request-list/request-list.component';

// 📦 路由配置
const routes: Routes = [
  { path: 'login', component: DriverLoginComponent },  // 登录页面
  { path: 'dashboard', component: DashboardComponent }, // 司机控制台
  { path: 'turn', loadChildren: () => import('@driver/turn/turn.module').then(m => m.TurnModule) }, // Story 5:创建与管理 Turn
  { path: 'request', component: RequestListComponent }, // Story 7:查看乘客请求
  { path: 'trip', loadChildren: () => import('@driver/trip/trip.module').then(m => m.TripModule) }, // Story 8:注册 Trip
  { path: 'invoice', loadChildren: () => import('./invoice/invoice.module').then(m => m.InvoiceModule) }, // Story 9:开具发票
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // 默认重定向到登录
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriverRoutingModule {}
