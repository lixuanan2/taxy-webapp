import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceRoutingModule } from './invoice-routing.module';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { IssueInvoiceComponent } from './issue-invoice/issue-invoice.component';
import { FormsModule } from '@angular/forms';
import { InvoiceDetailComponent } from './invoice-detail/invoice-detail.component';
import { MatButtonModule } from '@angular/material/button';
@NgModule({
  declarations: [
    InvoiceListComponent, IssueInvoiceComponent, InvoiceDetailComponent
  ],
  imports: [
    CommonModule,
    InvoiceRoutingModule,
    FormsModule,
    MatButtonModule
  ]
})
export class InvoiceModule { }
