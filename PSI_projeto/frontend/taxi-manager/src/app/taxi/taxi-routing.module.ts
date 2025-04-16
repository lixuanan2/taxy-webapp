import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaxiFormComponent } from './taxi-form/taxi-form.component';
import { TaxiListComponent } from './taxi-list/taxi-list.component';

const routes: Routes = [
  { path: 'taxi-form', component: TaxiFormComponent },
  { path: 'taxi-list', component: TaxiListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaxiRoutingModule { }
