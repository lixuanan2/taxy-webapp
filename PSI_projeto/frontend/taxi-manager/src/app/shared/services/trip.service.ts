import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Trip } from '@models/trip.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  private apiUrl = 'http://localhost:3000/api/trip';

  constructor(private http: HttpClient) {}

  createTrip(trip: Trip): Observable<Trip> {
    return this.http.post<Trip>(this.apiUrl, trip);
  }

  // 可扩展：获取所有旅程记录
  getAllTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(this.apiUrl);
  }

  getTripsByDriver(driverName: string): Observable<Trip[]> {
    return this.http.get<Trip[]>(`${this.apiUrl}?driverName=${driverName}`);
  }
  
}
