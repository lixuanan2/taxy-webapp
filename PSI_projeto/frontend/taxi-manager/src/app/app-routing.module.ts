/**
 * 🛣️ AppRoutingModule
 *
 * 应用主路由模块，定义根路径 ('/') 和各个子模块 (manager, driver, customer) 的入口。
 *
 * 路由结构：
 * - /main         ➔ MainDashboardComponent(主页面)
 * - /manager      ➔ ManagerModule(后台管理端)
 * - /driver       ➔ DriverModule(司机端)
 * - /customer     ➔ CustomerModule(客户端)
 *
 * 说明：
 * - 默认重定向到 /main;
 * - 采用懒加载(loadChildren)方式加载子模块，提升性能。
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainDashboardComponent } from './main-dashboard/main-dashboard.component';

const routes: Routes = [
  { path: '', redirectTo: '/main', pathMatch: 'full' },  // 默认重定向到 main
  { path: 'main', component: MainDashboardComponent },   // 主控制台页面
  { path: 'manager', loadChildren: () => import('./manager/manager.module').then(m => m.ManagerModule) },
  { path: 'driver', loadChildren: () => import('./driver/driver.module').then(m => m.DriverModule) },
  { path: 'customer', loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
