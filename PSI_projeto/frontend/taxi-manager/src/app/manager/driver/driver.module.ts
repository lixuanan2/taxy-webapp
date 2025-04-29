/**
 * 📄 DriverModule
 * 
 * 本模块负责管理司机（Driver）相关的功能，
 * 包括注册、查看和编辑司机信息。
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// 🚦 路由模块
import { DriverRoutingModule } from './driver-routing.module';

// 🧩 本模块内组件
import { DriverListComponent } from './driver-list/driver-list.component';
import { DriverFormComponent } from './driver-form/driver-form.component';
import { EditDriverComponent } from './edit-driver/edit-driver.component';

// 📦 共享模块与 UI 组件
import { SharedModule } from '@shared/shared.module';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    DriverListComponent,
    DriverFormComponent,
    EditDriverComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    DriverRoutingModule,
    SharedModule,
    MatButtonModule
  ]
})
export class DriverModule {}
