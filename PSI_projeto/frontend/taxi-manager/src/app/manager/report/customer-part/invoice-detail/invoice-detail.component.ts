import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InvoiceService } from '@services/invoice.service'; // 假设你有相应的服务
import { Invoice } from '@models/invoice.model'; // 假设你有相应的接口

@Component({
  selector: 'app-invoice-detail',
  templateUrl: './invoice-detail.component.html',
  styleUrls: ['./invoice-detail.component.css']
})
export class InvoiceDetailComponent implements OnInit {
  invoice: Invoice | null = null;

  constructor(
    private route: ActivatedRoute,
    private invoiceService: InvoiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.invoiceService.getInvoiceById(id).subscribe({
        next: (data) => this.invoice = data,
        error: (err) => {
          alert('❌ Erro ao buscar detalhes da fatura');
          this.router.navigate(['/manager/report']);
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/manager/report']);
  }
}
