import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportService } from '@shared/services/report.service';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.css']
})
export class CustomerDetailComponent implements OnInit {
  clientNIF: string = '';
  trips: any[] = [];

  start: string = '';
  end: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reportService: ReportService
  ) {}

  ngOnInit(): void {
    this.clientNIF = this.route.snapshot.paramMap.get('id') || '';
    this.start = this.route.snapshot.queryParamMap.get('start') || '';
    this.end = this.route.snapshot.queryParamMap.get('end') || '';

    if (this.clientNIF) {
      this.reportService.getTripsByClientNIF(this.clientNIF, this.start, this.end).subscribe(trips => {
        this.trips = trips;
      });      
    }
  }

  goBack(): void {
    this.router.navigate(['/manager/customer-report'], {
      queryParams: { start: this.start, end: this.end }
    });
  }
}
