/**
 * 🛣️ RequestRoutingModule
 *
 * 本模块定义客户请求(Request)相关的子路由:
 * - Create: 创建叫车请求
 * - Waiting: 等待司机响应
 * - History: 查看历史请求记录
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// 📄 页面组件导入
import { RequestCreateComponent } from './create/request-create.component';
import { WaitingComponent } from './waiting/waiting.component';
import { HistoryComponent } from './history/history.component';

const routes: Routes = [
  { path: 'create', component: RequestCreateComponent }, // 🚖 创建请求
  { path: 'history', component: HistoryComponent },      // 📜 请求历史
  { path: 'waiting', component: WaitingComponent },      // ⏳ 等待响应
  { path: '', redirectTo: 'create', pathMatch: 'full' }   // 默认重定向到创建
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestRoutingModule {}
