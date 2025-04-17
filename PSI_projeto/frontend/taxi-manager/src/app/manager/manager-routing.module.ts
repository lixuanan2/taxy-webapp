import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'taxi', loadChildren: () => import('@manager/taxi/taxi.module').then(m => m.TaxiModule) },
  { path: 'driver', loadChildren: () => import('@manager/driver/driver.module').then(m => m.DriverModule) },
  { path: 'price', loadChildren: () => import('@manager/price/price.module').then(m => m.PriceModule) },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerRoutingModule { }
