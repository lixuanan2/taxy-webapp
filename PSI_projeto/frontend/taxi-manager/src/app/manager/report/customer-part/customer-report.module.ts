import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CustomerReportRoutingModule } from './customer-report-routing.module';
import { CustomerReportDashboardComponent } from './report-dashboard/report-dashboard.component'; 
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';
import { InvoiceDetailComponent } from './invoice-detail/invoice-detail.component';
import { DriverReportModule } from '../driver-part/driver-report.module';

@NgModule({
  declarations: [
    CustomerReportDashboardComponent,
    CustomerDetailComponent,
    InvoiceDetailComponent
  ],
  imports: [
    CommonModule,
    CustomerReportRoutingModule,
    FormsModule,
    DriverReportModule
  ]
})
export class CustomerReportModule { }
