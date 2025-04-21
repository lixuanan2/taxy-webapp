import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportService } from '@shared/services/report/report.service';

@Component({
  selector: 'app-driver-detail',
  templateUrl: './driver-detail.component.html',
  styleUrls: ['./driver-detail.component.css']
})
export class DriverDetailComponent implements OnInit {
  driverName = '';
  start = '';
  end = '';
  trips: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reportService: ReportService
  ) {}

  ngOnInit(): void {
    this.driverName = this.route.snapshot.paramMap.get('name') || '';
    this.start = this.route.snapshot.queryParamMap.get('start') || '';
    this.end = this.route.snapshot.queryParamMap.get('end') || '';

    this.loadTrips();
  }

  loadTrips(): void {
    this.reportService.getTripsByDriver(this.driverName, this.start, this.end).subscribe(data => {
      this.trips = data.map(t => ({
        ...t,
        durationHours: (new Date(t.endTime).getTime() - new Date(t.startTime).getTime()) / 3600000
      }));
    });
  }

  goBack(): void {
    this.router.navigate(['/manager/report/driver-list'], {
      queryParams: { start: this.start, end: this.end }
    });
  }
}
