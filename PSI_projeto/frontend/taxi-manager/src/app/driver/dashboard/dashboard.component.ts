import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-driver-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{
  driverName = localStorage.getItem('currentDriverName') || 'Driver';
  
  hasPendingTrip = false;

  ngOnInit(): void {
    const latestRequest = localStorage.getItem('latestRequest');
    if (latestRequest) {
      this.hasPendingTrip = true;
    }
  }
}
