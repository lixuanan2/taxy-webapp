import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RequestRoutingModule } from './request-routing.module';
import { RequestCreateComponent } from './create/request-create.component';
import { WaitingComponent } from './waiting/waiting.component';


@NgModule({
  declarations: [
    RequestCreateComponent,
    WaitingComponent
  ],
  imports: [
    CommonModule,
    RequestRoutingModule,
    FormsModule
  ]
})
export class RequestModule { }
