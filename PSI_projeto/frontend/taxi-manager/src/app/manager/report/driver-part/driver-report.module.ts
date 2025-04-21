import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { DriverReportRoutingModule } from './driver-report-routing.module';
import { ReportDashboardComponent } from './report-dashboard/report-dashboard.component';
import { DriverDetailComponent } from './driver-detail/driver-detail.component';
import { TaxiDetailComponent } from './taxi-detail/taxi-detail.component';
import { TripDetailComponent } from '../trip-part/trip-detail/trip-detail.component';


@NgModule({
  declarations: [
    ReportDashboardComponent,
    DriverDetailComponent,
    TaxiDetailComponent,
    TripDetailComponent
  ],
  imports: [
    CommonModule,
    DriverReportRoutingModule,
    FormsModule
  ]
})
export class DriverReportModule { }
