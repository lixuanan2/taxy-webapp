/**
 * 📄 PriceRoutingModule
 * 
 * 本模块定义价格管理模块(Price Module)的子路由,
 * 包括设置价格 (PriceForm) 和查看价格历史 (PriceList)。
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// 🧩 本模块内页面组件
import { PriceFormComponent } from './price-form/price-form.component';
import { PriceListComponent } from './price-list/price-list.component';

// 🌟 价格模块子路由配置
const routes: Routes = [
  { path: 'price-form', component: PriceFormComponent },
  { path: 'price-list', component: PriceListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PriceRoutingModule {}
