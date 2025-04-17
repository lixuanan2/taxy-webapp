import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateTurnComponent } from './create-turn/create-turn.component';
import { TurnListComponent } from './turn-list/turn-list.component';

const routes: Routes = [
  { path: 'create', component: CreateTurnComponent },
  { path: 'list', component: TurnListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TurnRoutingModule {}
