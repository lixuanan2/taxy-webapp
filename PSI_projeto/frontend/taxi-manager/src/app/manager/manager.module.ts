import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// 🚦 子路由配置
import { ManagerRoutingModule } from './manager-routing.module';

// 🧩 页面组件
import { DashboardComponent } from './dashboard/dashboard.component';

// 📦 共享模块
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    ManagerRoutingModule,
    SharedModule
  ]
})
export class ManagerModule {}
