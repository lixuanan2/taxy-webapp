import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DriverFormComponent } from './driver-form/driver-form.component';
import { DriverListComponent } from './driver-list/driver-list.component';

const routes: Routes = [
  { path: 'driver-form', component: DriverFormComponent },
  { path: 'driver-list', component: DriverListComponent },
  { path: '', redirectTo: 'driver-list', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriverRoutingModule { }
