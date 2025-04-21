import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TripService } from '@services/trip.service';

@Component({
  selector: 'app-driver-detail',
  templateUrl: './driver-detail.component.html',
  styleUrls: ['./driver-detail.component.css']
})
export class DriverDetailComponent implements OnInit {
  driverName = '';
  start = new Date(new Date().setHours(0, 0, 0, 0));
  end = new Date();
  trips: any[] = [];

  constructor(private route: ActivatedRoute, private tripService: TripService) {}

  ngOnInit(): void {
    this.driverName = this.route.snapshot.paramMap.get('name') || '';
    this.loadTrips();
  }

  loadTrips(): void {
    this.tripService.getTrips({
      start: this.start,
      end: this.end,
      driverName: this.driverName
    }).subscribe(data => {
      this.trips = data.map((t: any) => ({
        ...t,
        durationHours: (new Date(t.endTime).getTime() - new Date(t.startTime).getTime()) / 3600000
      }));
    });
  }
}
