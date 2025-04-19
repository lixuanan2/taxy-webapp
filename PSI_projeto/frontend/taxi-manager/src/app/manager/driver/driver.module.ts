import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DriverRoutingModule } from './driver-routing.module';
import { DriverListComponent } from './driver-list/driver-list.component';
import { DriverFormComponent } from './driver-form/driver-form.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [
    DriverListComponent,
    DriverFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    DriverRoutingModule,
    SharedModule
  ]
})
export class DriverModule { }
