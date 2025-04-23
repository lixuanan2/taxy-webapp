import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DriverRoutingModule } from './driver-routing.module';

import { DriverLoginComponent } from './login/login.component';
import { DashboardComponent } from '@driver/dashboard/dashboard.component';
import { RequestListComponent } from './request-list/request-list.component';

import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    DriverLoginComponent,
    DashboardComponent,
    RequestListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    DriverRoutingModule,
    MatButtonModule
  ]
})
export class DriverModule { }
