import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DriverLoginComponent } from '@driver/login/login.component';
import { DashboardComponent } from '@driver/dashboard/dashboard.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: DriverLoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'turn', loadChildren: () => import('@driver/turn/turn.module').then(m => m.TurnModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriverRoutingModule { }
