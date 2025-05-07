/**
 * 📄 DriverRoutingModule
 *
 * 本模块定义司机模块(Driver Module)的内部子路由，
 * 包括注册司机、查看司机列表、编辑司机。
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// 🚗 组件导入
import { DriverFormComponent } from './driver-form/driver-form.component';
import { DriverListComponent } from './driver-list/driver-list.component';
import { EditDriverComponent } from './edit-driver/edit-driver.component';

// 🌟 司机模块子路由配置
const routes: Routes = [
  { path: 'driver-form', component: DriverFormComponent },
  { path: 'driver-list', component: DriverListComponent },
  { path: 'edit/:nif', component: EditDriverComponent },
  { path: '', redirectTo: 'driver-list', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriverRoutingModule {}
