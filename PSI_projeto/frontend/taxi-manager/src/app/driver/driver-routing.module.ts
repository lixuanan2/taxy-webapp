import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DriverLoginComponent } from '@driver/login/login.component';
import { DashboardComponent } from '@driver/dashboard/dashboard.component';

const routes: Routes = [
  { path: 'login', component: DriverLoginComponent },
  { path: 'dashboard', component: DashboardComponent } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriverRoutingModule { }
