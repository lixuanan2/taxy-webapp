import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RequestCreateComponent } from './create/request-create.component';
import { WaitingComponent } from './waiting/waiting.component';
import { HistoryComponent } from './history/history.component';

const routes: Routes = [
  { path: 'create', component: RequestCreateComponent },
  { path: 'history', component: HistoryComponent },
  { path: 'waiting', component: WaitingComponent },
  { path: '', redirectTo: 'create', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestRoutingModule { }
