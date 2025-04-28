/**
 * 📄 TaxiModule
 * 
 * 本模块负责管理与出租车(Taxi)相关的功能,
 * 包括注册出租车、展示出租车列表、编辑出租车。
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// 🚕 本模块内的路由模块
import { TaxiRoutingModule } from './taxi-routing.module';

// 🚖 本模块内的组件
import { TaxiListComponent } from './taxi-list/taxi-list.component';
import { TaxiFormComponent } from './taxi-form/taxi-form.component';
import { EditTaxiComponent } from './edit-taxi/edit-taxi.component';

// 🎨 Angular Material 相关模块（排版统一）
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';         // 支持错误提示图标
import { MatOptionModule } from '@angular/material/core';       // 确保 mat-option 渲染正常
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    TaxiListComponent,
    TaxiFormComponent,
    EditTaxiComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TaxiRoutingModule,

    // 📦 Material UI 组件模块
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatOptionModule,
    MatButtonModule
  ]
})
export class TaxiModule {}
