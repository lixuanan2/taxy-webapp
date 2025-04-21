import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportService } from '@shared/services/report/report.service';

@Component({
  selector: 'app-taxi-list',
  templateUrl: './taxi-list.component.html',
  styleUrls: ['./taxi-list.component.css']
})
export class TaxiListComponent implements OnInit {
  start: string = '';
  end: string = '';
  taxiStats: any[] = [];

  constructor(
    private reportService: ReportService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.start = this.route.snapshot.queryParamMap.get('start') || '';
    this.end = this.route.snapshot.queryParamMap.get('end') || '';

    this.reportService.getTaxiStats(this.start, this.end).subscribe(data => {
      this.taxiStats = data;
    });
  }

  goToTaxiDetail(plate: string): void {
    this.router.navigate(['/manager/report/taxi', plate], {
      queryParams: { start: this.start, end: this.end }
    });
  }

  goBack(): void {
    this.router.navigate(['/manager/report'], {
      queryParams: { start: this.start, end: this.end }
    });
  }
}
