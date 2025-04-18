import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceRoutingModule } from './invoice-routing.module';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { IssueInvoiceComponent } from './issue-invoice/issue-invoice.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    InvoiceListComponent, IssueInvoiceComponent
  ],
  imports: [
    CommonModule,
    InvoiceRoutingModule,
    FormsModule
  ]
})
export class InvoiceModule { }
