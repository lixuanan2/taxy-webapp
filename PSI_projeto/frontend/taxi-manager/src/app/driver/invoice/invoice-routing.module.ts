import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IssueInvoiceComponent } from '@driver/invoice/issue-invoice/issue-invoice.component';
import { InvoiceListComponent } from '@driver/invoice/invoice-list/invoice-list.component';
import { InvoiceDetailComponent } from './invoice-detail/invoice-detail.component';

const routes: Routes = [
  { path: 'issue', component: IssueInvoiceComponent },
  { path: 'list', component: InvoiceListComponent },
  { path: 'detail/:id', component: InvoiceDetailComponent },
  { path: '', redirectTo: 'list', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoiceRoutingModule {}
