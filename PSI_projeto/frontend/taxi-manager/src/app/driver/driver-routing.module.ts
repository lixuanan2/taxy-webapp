import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DriverLoginComponent } from '@driver/login/login.component';
import { DashboardComponent } from '@driver/dashboard/dashboard.component';
import { RequestListComponent } from './request/request-list/request-list.component';

const routes: Routes = [
  { path: 'login', component: DriverLoginComponent },          // 登录页
  { path: 'dashboard', component: DashboardComponent },        // 控制台
  { path: 'turn', loadChildren: () => import('@driver/turn/turn.module').then(m => m.TurnModule) },  // Story 5
  { path: 'request', component: RequestListComponent },        // 请求列表(Story 7)
  { path: 'trip', loadChildren: () => import('@driver/trip/trip.module').then(m => m.TripModule) }, // (story 8)
  { path: 'invoice', loadChildren: () => import('./invoice/invoice.module').then(m => m.InvoiceModule) }, // 9
  { path: '', redirectTo: 'login', pathMatch: 'full' },        // 默认跳转
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriverRoutingModule { }
