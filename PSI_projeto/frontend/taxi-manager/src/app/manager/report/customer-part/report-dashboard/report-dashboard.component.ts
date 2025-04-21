import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReportService } from '@shared/services/report/report.service';  // 你已经有的服务
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-customer-report-dashboard',
  templateUrl: './report-dashboard.component.html',
  styleUrls: ['./report-dashboard.component.css']
})
export class CustomerReportDashboardComponent implements OnInit {
  start: string = new Date().toISOString().slice(0, 10); // 默认今天
  end: string = new Date().toISOString().slice(0, 10);

  totalAmount = 0;
  totalTrips = 0;
  totalClients = 0;

  customerStats: any[] = [];
  tripStats: any[] = [];

  constructor(
    private reportService: ReportService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const queryStart = this.route.snapshot.queryParamMap.get('start');
    const queryEnd = this.route.snapshot.queryParamMap.get('end');
  
    this.start = queryStart || new Date().toISOString().slice(0, 10);
    this.end = queryEnd || new Date().toISOString().slice(0, 10);
  
    this.loadAllStats();
  }
  

  loadAllStats(): void {
    this.reportService.getCustomerOverallStats(this.start, this.end).subscribe(data => {
      this.totalAmount = data.totalAmount;
      this.totalTrips = data.totalTrips;
      this.totalClients = data.totalClients;
    });
  
    this.reportService.getCustomerStats(this.start, this.end).subscribe(data => {
      this.customerStats = data;
    });
  
    this.reportService.getTripStats(this.start, this.end).subscribe(data => {
      this.tripStats = data;
    });
  }
  

  onDateChange(): void {
    this.loadAllStats();
  }

  goToTrip(): void {
    this.router.navigate(['/manager/customer-report/trip'], {
      queryParams: { start: this.start, end: this.end }
    });
  }

  goToCustomerList(): void {
    this.router.navigate(['/manager/customer-report/customer-list'], {
      queryParams: { start: this.start, end: this.end }
    });
  }
  
  
}
