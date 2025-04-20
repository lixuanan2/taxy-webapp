import { Component, OnInit } from '@angular/core';
import { ReportService } from '@shared/services/report.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-report-dashboard',
  templateUrl: './report-dashboard.component.html',
  styleUrls: ['./report-dashboard.component.css']
})
export class ReportDashboardComponent implements OnInit {
  start: string = new Date().toISOString().slice(0, 10); // 默认今天
  end: string = new Date().toISOString().slice(0, 10);

  totalTrips = 0;
  totalHours = 0;
  totalKm = 0;

  driverStats: any[] = [];
  taxiStats: any[] = [];

  constructor(
    private reportService: ReportService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAllStats();
  }

  loadAllStats(): void {
    this.reportService.getOverallStats(this.start, this.end).subscribe(data => {
      this.totalTrips = data.totalTrips;
      this.totalHours = +data.totalHours.toFixed(2);
      this.totalKm = +data.totalKm.toFixed(2);
    });

    this.reportService.getDriverStats(this.start, this.end).subscribe(data => {
      this.driverStats = data;
    });

    this.reportService.getTaxiStats(this.start, this.end).subscribe(data => {
      this.taxiStats = data;
    });
  }

  onDateChange(): void {
    this.loadAllStats();
  }

  goToDriver(name: string): void {
    this.router.navigate(['/manager/report/driver', name], {
      queryParams: { start: this.start, end: this.end }
    });
  }

  goToTaxi(plate: string): void {
    this.router.navigate(['/manager/report/taxi', plate], {
      queryParams: { start: this.start, end: this.end }
    });
  }

  goToTrip(): void {
    this.router.navigate(['/manager/report/trip'], {
      queryParams: { start: this.start, end: this.end }
    });
  }
}
