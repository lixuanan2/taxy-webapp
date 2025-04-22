import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TaxiRoutingModule } from './taxi-routing.module';
import { TaxiListComponent } from './taxi-list/taxi-list.component';
import { TaxiFormComponent } from './taxi-form/taxi-form.component';
import { EditTaxiComponent } from './edit-taxi/edit-taxi.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon'; // 可选：支持错误图标显示
import { MatOptionModule } from '@angular/material/core'; // 重要：确保 mat-option 识别
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [
    TaxiListComponent,
    TaxiFormComponent,
    EditTaxiComponent
  ],
  imports: [
    CommonModule,
    TaxiRoutingModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatOptionModule,
    MatButtonModule
  ]
})
export class TaxiModule { }
