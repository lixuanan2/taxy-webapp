import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DriverRoutingModule } from './driver-routing.module';

import { DriverLoginComponent } from './login/login.component';
import { DashboardComponent } from '@driver/dashboard/dashboard.component';
import { RequestListComponent } from './request/request-list/request-list.component';

@NgModule({
  declarations: [
    DriverLoginComponent,
    DashboardComponent,
    RequestListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    DriverRoutingModule
  ]
})
export class DriverModule { }
