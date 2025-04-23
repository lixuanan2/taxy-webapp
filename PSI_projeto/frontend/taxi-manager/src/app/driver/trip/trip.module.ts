import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TripRoutingModule } from './trip-routing.module';
import { TripListComponent } from './trip-list/trip-list.component';
import { RegisterTripComponent } from './register-trip/register-trip.component';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [
    RegisterTripComponent,
    TripListComponent
  ],
  imports: [
    CommonModule,
    TripRoutingModule,
    FormsModule,
    MatButtonModule
  ]
})
export class TripModule { }
