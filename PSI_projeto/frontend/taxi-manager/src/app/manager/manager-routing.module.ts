/**
 * 📄 ManagerRoutingModule
 *
 * 本模块定义 Manager 区域的路由规则，包括：
 * - Dashboard
 * - Taxi、Driver、Price 模块 (管理功能)
 * - Driver Report、Customer Report (报表功能)
 *
 * 使用了懒加载(lazy loading)机制提升模块加载效率。
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// 🏢 Manager 主控制台组件
import { DashboardComponent } from './dashboard/dashboard.component';

// 📦 路由配置
const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent }, // Manager 控制台
  { path: 'taxi', loadChildren: () => import('@manager/taxi/taxi.module').then(m => m.TaxiModule) }, // 出租车管理
  { path: 'driver', loadChildren: () => import('@manager/driver/driver.module').then(m => m.DriverModule) }, // 司机管理
  { path: 'price', loadChildren: () => import('@manager/price/price.module').then(m => m.PriceModule) }, // 价格配置
  { path: 'report', loadChildren: () => import('./report/driver-part/driver-report.module').then(m => m.DriverReportModule) }, // 司机统计报表
  { path: 'customer-report', loadChildren: () => import('./report/customer-part/customer-report.module').then(m => m.CustomerReportModule) }, // 客户统计报表
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' } // 默认跳转到 dashboard
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerRoutingModule {}
