import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RequestRoutingModule } from './request-routing.module';
import { RequestCreateComponent } from './create/request-create.component';
import { WaitingComponent } from './waiting/waiting.component';
import { HistoryComponent } from './history/history.component';

import { DriverConfirmDialogComponent } from './driver-confirm-dialog/driver-confirm-dialog.component';
import { SharedModule } from '@shared/shared.module'; 
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    RequestCreateComponent,
    WaitingComponent,
    DriverConfirmDialogComponent,
    HistoryComponent
  ],
  imports: [
    CommonModule,
    RequestRoutingModule,
    FormsModule,
    SharedModule,
    MatButtonModule
  ]
})
export class RequestModule { }
