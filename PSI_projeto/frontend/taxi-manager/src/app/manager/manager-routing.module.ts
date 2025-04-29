import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// 🧭 主控制面板组件
import { DashboardComponent } from './dashboard/dashboard.component';

// 📦 懒加载子模块
const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'taxi', loadChildren: () => import('@manager/taxi/taxi.module').then(m => m.TaxiModule) },
  { path: 'driver', loadChildren: () => import('@manager/driver/driver.module').then(m => m.DriverModule) },
  { path: 'price', loadChildren: () => import('@manager/price/price.module').then(m => m.PriceModule) },
  { path: 'report', loadChildren: () => import('./report/driver-part/driver-report.module').then(m => m.DriverReportModule) },
  { path: 'customer-report', loadChildren: () => import('./report/customer-part/customer-report.module').then(m => m.CustomerReportModule) },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerRoutingModule {}
