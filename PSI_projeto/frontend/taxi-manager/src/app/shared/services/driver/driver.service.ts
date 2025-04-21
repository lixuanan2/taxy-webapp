import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Driver } from '@models/driver.model';

@Injectable({ providedIn: 'root' })
export class DriverService {
  private apiUrl = 'http://localhost:3000/api/drivers';

  constructor(private http: HttpClient) {}

  getDrivers(): Observable<Driver[]> {
    return this.http.get<Driver[]>(this.apiUrl);
  }

  createDriver(driver: Driver): Observable<Driver> {
    return this.http.post<Driver>(this.apiUrl, driver);
  }

  deleteDriver(nif: string) {
    return this.http.delete(`/api/drivers/${nif}`);
  }
  
  getDriverByNif(nif: string): Observable<Driver> {
    return this.http.get<Driver>(`${this.apiUrl}/${nif}`);
  }
  
  updateDriver(nif: string, data: Driver): Observable<any> {
    return this.http.put(`${this.apiUrl}/${nif}`, data);
  }
  
}
