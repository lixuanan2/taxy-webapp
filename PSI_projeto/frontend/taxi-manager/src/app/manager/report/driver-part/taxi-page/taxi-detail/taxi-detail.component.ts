import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TripService } from '@services/trip.service';

@Component({
  selector: 'app-taxi-detail',
  templateUrl: './taxi-detail.component.html',
  styleUrls: ['./taxi-detail.component.css']
})
export class TaxiDetailComponent implements OnInit {
  vehiclePlate = '';
  start = new Date(new Date().setHours(0, 0, 0, 0));
  end = new Date();
  trips: any[] = [];

  constructor(private route: ActivatedRoute, private tripService: TripService) {}

  ngOnInit(): void {
    this.vehiclePlate = this.route.snapshot.paramMap.get('plate') || '';
    this.loadTrips();
  }

  loadTrips(): void {
    this.tripService.getTrips({
      start: this.start,
      end: this.end,
      vehiclePlate: this.vehiclePlate
    }).subscribe(data => {
      this.trips = data.map((t: any) => ({
        ...t,
        durationHours: (new Date(t.endTime).getTime() - new Date(t.startTime).getTime()) / 3600000
      }));
    });
  }
}
