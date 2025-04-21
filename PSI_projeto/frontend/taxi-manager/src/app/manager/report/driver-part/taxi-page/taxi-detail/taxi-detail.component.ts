import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReportService } from '@shared/services/report/report.service';

@Component({
  selector: 'app-taxi-detail',
  templateUrl: './taxi-detail.component.html',
  styleUrls: ['./taxi-detail.component.css']
})
export class TaxiDetailComponent implements OnInit {
  vehiclePlate = '';
  start = '';
  end = '';
  trips: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private reportService: ReportService
  ) {}

  ngOnInit(): void {
    this.vehiclePlate = this.route.snapshot.paramMap.get('plate') || '';
    this.start = this.route.snapshot.queryParamMap.get('start') || '';
    this.end = this.route.snapshot.queryParamMap.get('end') || '';

    if (this.vehiclePlate) {
      this.reportService.getTripsByTaxi(this.vehiclePlate, this.start, this.end).subscribe(data => {
        this.trips = data.map(t => ({
          ...t,
          durationHours: (new Date(t.endTime).getTime() - new Date(t.startTime).getTime()) / 3600000
        }));
      });
    }
  }
}
