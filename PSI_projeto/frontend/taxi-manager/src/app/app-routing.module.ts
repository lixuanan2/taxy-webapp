import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'taxi', loadChildren: () => import('./taxi/taxi.module').then(m => m.TaxiModule) },
  { path: '', redirectTo: '/taxi/taxi-form', pathMatch: 'full' } // 默认跳转
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
