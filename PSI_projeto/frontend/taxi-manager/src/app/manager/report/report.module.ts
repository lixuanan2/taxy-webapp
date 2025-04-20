import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { ReportRoutingModule } from './report-routing.module';
import { ReportDashboardComponent } from './driver-part/report-dashboard/report-dashboard.component';
import { DriverDetailComponent } from './driver-part/driver-detail/driver-detail.component';
import { TaxiDetailComponent } from './driver-part/taxi-detail/taxi-detail.component';
import { TripDetailComponent } from './driver-part/trip-detail/trip-detail.component';


@NgModule({
  declarations: [
    ReportDashboardComponent,
    DriverDetailComponent,
    TaxiDetailComponent,
    TripDetailComponent
  ],
  imports: [
    CommonModule,
    ReportRoutingModule,
    FormsModule
  ]
})
export class ReportModule { }
