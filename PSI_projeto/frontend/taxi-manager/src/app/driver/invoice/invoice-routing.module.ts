import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IssueInvoiceComponent } from '@driver/invoice/issue-invoice/issue-invoice.component';
import { InvoiceListComponent } from '@driver/invoice/invoice-list/invoice-list.component';

const routes: Routes = [
  //{ path: ':invoiceId', component: InvoiceDetailComponent },
  { path: 'issue', component: IssueInvoiceComponent },
  { path: 'list', component: InvoiceListComponent },
  { path: '', redirectTo: 'list', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoiceRoutingModule {}
