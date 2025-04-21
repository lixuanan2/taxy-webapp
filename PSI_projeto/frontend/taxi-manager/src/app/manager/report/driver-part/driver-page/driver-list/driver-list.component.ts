import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportService } from '@shared/services/report/report.service';

@Component({
  selector: 'app-driver-list',
  templateUrl: './driver-list.component.html',
  styleUrls: ['./driver-list.component.css']
})
export class DriverListComponent implements OnInit {
  start: string = '';
  end: string = '';
  driverStats: any[] = [];

  constructor(
    private reportService: ReportService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.start = this.route.snapshot.queryParamMap.get('start') || '';
    this.end = this.route.snapshot.queryParamMap.get('end') || '';

    this.reportService.getDriverStats(this.start, this.end).subscribe(data => {
      this.driverStats = data;
    });
  }

  goToDriverDetail(name: string): void {
    this.router.navigate(['/manager/report/driver', name], {
      queryParams: { start: this.start, end: this.end }
    });
  }

  goBack(): void {
    this.router.navigate(['/manager/report'], {
      queryParams: { start: this.start, end: this.end }
    });
  }
}
