// src/app/driver/turn/turn.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TurnRoutingModule } from './turn-routing.module';
import { CreateTurnComponent } from './create-turn/create-turn.component';
import { TurnListComponent } from './turn-list/turn-list.component';

@NgModule({
  declarations: [
    CreateTurnComponent,
    TurnListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TurnRoutingModule
  ]
})
export class TurnModule { }
