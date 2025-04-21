import { Component, OnInit } from '@angular/core';
import { ReportService } from '@shared/services/report.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';


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

  constructor(
    private reportService: ReportService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const urlStart = this.route.snapshot.queryParamMap.get('start');
    const urlEnd = this.route.snapshot.queryParamMap.get('end');
  
    if (urlStart) this.start = urlStart;
    if (urlEnd) this.end = urlEnd;
  
    this.loadAllStats();
  }
  

  loadAllStats(): void {
    this.reportService.getOverallStats(this.start, this.end).subscribe(data => {
      this.totalTrips = data.totalTrips;
      this.totalHours = +data.totalHours.toFixed(2);
      this.totalKm = +data.totalKm.toFixed(2);
    });

  }

  onDateChange(): void {
    this.loadAllStats();
  }

  goToDriverList(): void {
    this.router.navigate(['/manager/report/driver-list'], {
      queryParams: { start: this.start, end: this.end }
    });
  }
  
  goToTaxiList(): void {
    this.router.navigate(['/manager/report/taxi-list'], {
      queryParams: { start: this.start, end: this.end }
    });
  }
  
  goToTrip(): void {
    this.router.navigate(['/manager/report/trip'], {
      queryParams: { start: this.start, end: this.end }
    });
  }
  
}
