/**
 * 🛣️ CustomerRoutingModule
 *
 * 本模块定义客户（Customer）相关的子路由：
 * - Dashboard 首页
 * - Request 子模块（懒加载）
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// 📄 组件导入
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent }, // 🏠 客户首页
  { path: 'request', loadChildren: () => import('@customer/request/request.module').then(m => m.RequestModule) }, // 🚖 Request 子模块
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' } // 默认重定向
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule {}
