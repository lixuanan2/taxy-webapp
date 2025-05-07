import { Component, OnInit } from '@angular/core';
import { Trip } from '@models/trip.model';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ReportService } from '@shared/services/report/report.service';

@Component({
  selector: 'app-trip-detail',
  templateUrl: './trip-detail.component.html',
  styleUrls: ['./trip-detail.component.css']
})
export class TripDetailComponent implements OnInit {
  trips: Trip[] = [];

  start: string = '';
  end: string = '';

  constructor(
    private reportService: ReportService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.start = this.route.snapshot.queryParamMap.get('start') || '';
    this.end = this.route.snapshot.queryParamMap.get('end') || '';

    this.reportService.getTrips(this.start, this.end).subscribe({
      next: data => this.trips = data,
      error: err => console.error('Erro ao buscar viagens', err)
    });
  }

  getDuration(t: Trip): string {
    const start = new Date(t.startTime);
    const end = new Date(t.endTime);
    const duration = (end.getTime() - start.getTime()) / 3600000;
    return duration.toFixed(2);
  }

  goBack(): void {
    const basePath = this.router.url.includes('customer-report')
      ? '/manager/customer-report'
      : '/manager/report';

    this.router.navigate([basePath], {
      queryParams: {
        start: this.start,
        end: this.end
      }
    });
  }

}
