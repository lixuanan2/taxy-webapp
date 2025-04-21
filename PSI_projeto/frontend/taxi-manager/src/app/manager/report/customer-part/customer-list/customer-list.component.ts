import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportService } from '@shared/services/report.service';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {
  start: string = '';
  end: string = '';
  customerStats: any[] = [];

  constructor(
    private reportService: ReportService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.start = this.route.snapshot.queryParamMap.get('start') || '';
    this.end = this.route.snapshot.queryParamMap.get('end') || '';

    this.reportService.getCustomerStats(this.start, this.end).subscribe(stats => {
      this.customerStats = stats;
    });
  }

  goToCustomerDetail(nif: string): void {
    this.router.navigate(['/manager/customer-report/customer-detail', nif], {
      queryParams: { start: this.start, end: this.end }
    });
  }

  goBack(): void {
    this.router.navigate(['/manager/customer-report'], {
      queryParams: { start: this.start, end: this.end }
    });    
  }
}
