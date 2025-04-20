import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaxiFormComponent } from './taxi-form/taxi-form.component';
import { TaxiListComponent } from './taxi-list/taxi-list.component';
import { EditTaxiComponent } from './edit-taxi/edit-taxi.component';

const routes: Routes = [
  { path: 'taxi-form', component: TaxiFormComponent },
  { path: 'taxi-list', component: TaxiListComponent },
  { path: 'edit/:plate', component: EditTaxiComponent },
  { path: '', redirectTo: 'taxi-list', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaxiRoutingModule { }
