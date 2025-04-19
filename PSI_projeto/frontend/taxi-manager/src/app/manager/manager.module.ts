import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagerRoutingModule } from './manager-routing.module';

import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  declarations: [
    DashboardComponent 
  ],
  imports: [
    CommonModule,
    ManagerRoutingModule,
    SharedModule
  ]
})
export class ManagerModule { }
