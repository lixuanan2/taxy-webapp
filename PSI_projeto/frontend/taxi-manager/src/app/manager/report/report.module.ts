import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { ReportRoutingModule } from './report-routing.module';
import { ReportDashboardComponent } from './report-dashboard/report-dashboard.component';
import { DriverDetailComponent } from './driver-detail/driver-detail.component';
import { TaxiDetailComponent } from './taxi-detail/taxi-detail.component';
import { TripDetailComponent } from './trip-detail/trip-detail.component';


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
