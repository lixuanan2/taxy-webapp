import { Component, OnInit } from '@angular/core';
import { TripService } from '@services/trip.service';
import { Trip } from '@models/trip.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trip-detail',
  templateUrl: './trip-detail.component.html'
})
export class TripDetailComponent implements OnInit {
  trips: Trip[] = [];

  constructor(
    private tripService: TripService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.tripService.getTrips().subscribe({
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
    this.router.navigate(['/manager/report']);
  }
}
