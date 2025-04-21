import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CustomerReportDashboardComponent } from './report-dashboard/report-dashboard.component'; 
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';
import { TripDetailComponent } from '../trip-part/trip-detail/trip-detail.component';
import { CustomerListComponent } from './customer-list/customer-list.component';

const routes: Routes = [
  { path: '', component: CustomerReportDashboardComponent },
  { path: 'trip', component: TripDetailComponent },
  { path: 'customer-list', component: CustomerListComponent },
  { path: 'customer-detail/:nif', component: CustomerDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerReportRoutingModule { }
