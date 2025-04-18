import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RegisterTripComponent } from './register-trip/register-trip.component';
import { TripListComponent } from './trip-list/trip-list.component';

const routes: Routes = [
  { path: 'register', component: RegisterTripComponent },
  { path: 'list', component: TripListComponent },
  { path: '', redirectTo: 'list', pathMatch: 'full' }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TripRoutingModule { }
