import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReportService } from '@shared/services/report.service';  // 你已经有的服务
import { RequestService } from '@shared/services/request.service';  // 你已经有的服务

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
    private requestService: RequestService
  ) {}

  ngOnInit(): void {
    this.loadAllStats();
  }

  loadAllStats(): void {
    this.reportService.getOverallStats(this.start, this.end).subscribe(data => {
      this.totalAmount = data.totalAmount;
      this.totalTrips = data.totalTrips;
      this.totalClients = data.totalClients;
    });

    // Fetch customer stats for the report
    this.reportService.getCustomerStats(this.start, this.end).subscribe(data => {
      console.log('💬 客户统计数据:', data);  // ⛔ 这里看看有没有 clientNIF 字段
      this.customerStats = data;
    });
    

    // Fetch trip stats for the report
    this.reportService.getTripStats(this.start, this.end).subscribe(data => {
      this.tripStats = data;
    });
  }

  onDateChange(): void {
    this.loadAllStats();
  }

  goToCustomer(clientNIF: string): void {
    if (!clientNIF) return;  // ⛔ 不跳转
    this.router.navigate(['/manager/customer-report/customer-detail', clientNIF], {
      queryParams: { start: this.start, end: this.end }
    });
  }
  

  goToTrip(): void {
    this.router.navigate(['/manager/customer-report/trip'], {
      queryParams: { start: this.start, end: this.end }
    });
  }

  // Other navigational methods if needed
  goToInvoice(invoiceId: string): void {
    this.router.navigate(['/manager/custmor-report/invoice', invoiceId], {
      queryParams: { start: this.start, end: this.end }
    });
  }
}
