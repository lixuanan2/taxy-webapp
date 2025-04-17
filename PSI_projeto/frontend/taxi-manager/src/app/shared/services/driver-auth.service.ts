import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Driver } from '@models/driver.model';

@Injectable({
  providedIn: 'root'
})
export class DriverAuthService {
  private currentDriverSubject = new BehaviorSubject<Driver | null>(null);
  currentDriver$ = this.currentDriverSubject.asObservable();

  login(driver: Driver) {
    this.currentDriverSubject.next(driver);
  }

  logout() {
    this.currentDriverSubject.next(null);
  }

  getCurrentDriver(): Driver | null {
    return this.currentDriverSubject.value;
  }
}
