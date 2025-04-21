import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CustomerReportDashboardComponent } from './report-dashboard/report-dashboard.component'; 
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';
import { InvoiceDetailComponent } from './invoice-detail/invoice-detail.component';
import { TripDetailComponent } from '../trip-part/trip-detail/trip-detail.component';

const routes: Routes = [
  { path: '', component: CustomerReportDashboardComponent },
  { path: 'customer/:id', component: CustomerDetailComponent },
  { path: 'invoice/:id', component: InvoiceDetailComponent },
  { path: 'trip', component: TripDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerReportRoutingModule { }
