import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { DriverReportRoutingModule } from './driver-report-routing.module';
import { ReportDashboardComponent } from './report-dashboard/report-dashboard.component';
import { DriverDetailComponent } from './driver-page/driver-detail/driver-detail.component';
import { TaxiDetailComponent } from './taxi-page/taxi-detail/taxi-detail.component';
import { TripDetailComponent } from '../trip-part/trip-detail/trip-detail.component';
import { DriverListComponent } from './driver-page/driver-list/driver-list.component';
import { TaxiListComponent } from './taxi-page/taxi-list/taxi-list.component';


@NgModule({
  declarations: [
    ReportDashboardComponent,
    DriverDetailComponent,
    TaxiDetailComponent,
    TripDetailComponent,
    DriverListComponent,
    TaxiListComponent
  ],
  imports: [
    CommonModule,
    DriverReportRoutingModule,
    FormsModule
  ]
})
export class DriverReportModule { }
