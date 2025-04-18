import { Component, OnInit } from '@angular/core';
import { TripService } from '@services/trip.service';
import { Trip } from '@models/trip.model';

@Component({
  selector: 'app-trip-list',
  templateUrl: './trip-list.component.html',
  styleUrls: ['./trip-list.component.css']
})
export class TripListComponent implements OnInit {
  trips: Trip[] = [];

  constructor(private tripService: TripService) {}

  ngOnInit(): void {
    this.tripService.getAllTrips().subscribe({
      next: (data) => {
        // 按 startTime 降序排列
        this.trips = data.sort((a, b) =>
          new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
        );
      },
      error: (err) => {
        console.error('Erro ao carregar viagens:', err);
      }
    });
  }
}
