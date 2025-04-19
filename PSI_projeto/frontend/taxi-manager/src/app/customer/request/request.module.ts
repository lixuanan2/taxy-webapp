import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RequestRoutingModule } from './request-routing.module';
import { RequestCreateComponent } from './create/request-create.component';
import { WaitingComponent } from './waiting/waiting.component';
import { DriverConfirmDialogComponent } from './driver-confirm-dialog/driver-confirm-dialog.component';
import { SharedModule } from '@shared/shared.module'; 

@NgModule({
  declarations: [
    RequestCreateComponent,
    WaitingComponent,
    DriverConfirmDialogComponent
  ],
  imports: [
    CommonModule,
    RequestRoutingModule,
    FormsModule,
    SharedModule
  ]
})
export class RequestModule { }
