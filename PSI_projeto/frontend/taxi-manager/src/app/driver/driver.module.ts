import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DriverRoutingModule } from './driver-routing.module';
import { FormsModule } from '@angular/forms';

import { DriverLoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    DriverLoginComponent
  ],
  imports: [
    CommonModule,
    DriverRoutingModule,
    FormsModule
  ]
})
export class DriverModule { }
