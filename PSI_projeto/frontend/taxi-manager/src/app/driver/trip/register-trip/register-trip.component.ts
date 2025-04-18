import { Component, OnInit } from '@angular/core';
import { TripService } from '@services/trip.service';
import { Trip } from '@models/trip.model';

@Component({
  selector: 'app-register-trip',
  templateUrl: './register-trip.component.html',
  styleUrls: ['./register-trip.component.css']
})
export class RegisterTripComponent implements OnInit{
  trip: Trip = {
    driverName: localStorage.getItem('currentDriverName') || '',
    clientNIF: '',
    from: '',
    to: '',
    startTime: new Date(),
    endTime: new Date(),
    price: 0,
    vehiclePlate: '',
    peopleCount: 1,
    sequenceNumber: 1
  };

  constructor(private tripService: TripService) {}

  onSubmit(): void {
    this.tripService.createTrip(this.trip).subscribe({
      next: () => {
        alert('✅ Viagem registada com sucesso!');

        localStorage.removeItem('latestRequest');

        this.resetForm();
      },
      error: err => {
        alert('❌ Erro ao registar a viagem.');
        console.error(err);
      }
    });
  }

  resetForm(): void {
    this.trip = {
      driverName: localStorage.getItem('currentDriverName') || '',
      clientNIF: '',
      from: '',
      to: '',
      startTime: new Date(),
      endTime: new Date(),
      price: 0,
      vehiclePlate: '',
      peopleCount: 1,
      sequenceNumber: 1
    };
  }

  ngOnInit(): void {
    const latestRequest = localStorage.getItem('latestRequest');
    if (latestRequest) {
      const request = JSON.parse(latestRequest);

      this.trip.clientNIF = request.nif;
      this.trip.from = request.currentLocation;
      this.trip.to = request.destination;
      this.trip.peopleCount = request.peopleCount || 1;
    }
  }
}
