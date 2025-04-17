import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PriceFormComponent } from './price-form/price-form.component';
import { PriceListComponent } from './price-list/price-list.component';

const routes: Routes = [
  { path: 'price-form', component: PriceFormComponent },
  { path: 'price-list', component: PriceListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PriceRoutingModule { }
