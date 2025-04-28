/**
 * 📄 TaxiRoutingModule
 * 
 * 本模块配置出租车模块（Taxi Module）的内部路由，
 * 包括添加出租车、查看出租车列表、编辑出租车等页面。
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TaxiFormComponent } from './taxi-form/taxi-form.component';
import { TaxiListComponent } from './taxi-list/taxi-list.component';
import { EditTaxiComponent } from './edit-taxi/edit-taxi.component';

// 🌟 出租车模块子路由配置
const routes: Routes = [
  { path: 'taxi-form', component: TaxiFormComponent },
  { path: 'taxi-list', component: TaxiListComponent },
  { path: 'edit/:plate', component: EditTaxiComponent },
  { path: '', redirectTo: 'taxi-list', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaxiRoutingModule {}
