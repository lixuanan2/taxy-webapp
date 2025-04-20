import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ReportDashboardComponent } from './driver-part/report-dashboard/report-dashboard.component';

import { DriverDetailComponent } from './driver-part/driver-detail/driver-detail.component';
import { TaxiDetailComponent } from './driver-part/taxi-detail/taxi-detail.component';
import { TripDetailComponent } from './driver-part/trip-detail/trip-detail.component';


const routes: Routes = [
  { path: '', component: ReportDashboardComponent },
  { path: 'trip', component: TripDetailComponent },
  { path: 'driver/:name', component: DriverDetailComponent },
  { path: 'taxi/:plate', component: TaxiDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
