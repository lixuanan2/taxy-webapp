/**
 * 📄 PriceModule
 * 
 * 本模块负责出租车价格（Price）相关功能，
 * 包括设置基本/豪华价格、夜间附加费，
 * 以及查看价格历史记录。
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// 🚦 路由模块
import { PriceRoutingModule } from './price-routing.module';

// 🧩 本模块内组件
import { PriceFormComponent } from './price-form/price-form.component';
import { PriceListComponent } from './price-list/price-list.component';

// 📦 Material 组件
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    PriceFormComponent,
    PriceListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PriceRoutingModule,

    // 🎨 Material UI 模块
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatOptionModule,
    MatButtonModule
  ]
})
export class PriceModule {}
