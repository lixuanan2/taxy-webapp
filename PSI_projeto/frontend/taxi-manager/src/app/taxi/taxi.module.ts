import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TaxiRoutingModule } from './taxi-routing.module';
import { TaxiListComponent } from './taxi-list/taxi-list.component';
import { TaxiFormComponent } from './taxi-form/taxi-form.component';


@NgModule({
  declarations: [
    TaxiListComponent,
    TaxiFormComponent
  ],
  imports: [
    CommonModule,
    TaxiRoutingModule,
    FormsModule
  ]
})
export class TaxiModule { }
