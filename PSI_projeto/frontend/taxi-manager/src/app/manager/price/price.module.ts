import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PriceRoutingModule } from './price-routing.module';
import { PriceFormComponent } from './price-form/price-form.component';
import { PriceListComponent } from './price-list/price-list.component';

@NgModule({
  declarations: [
    PriceFormComponent,
    PriceListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PriceRoutingModule
  ]
})
export class PriceModule { }
