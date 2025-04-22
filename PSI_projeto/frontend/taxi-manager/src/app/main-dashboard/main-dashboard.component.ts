import { Component } from '@angular/core';
import { Router } from '@angular/router';


type Role = 'manager' | 'driver' | 'customer';

@Component({
  selector: 'app-main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.css']
})

export class MainDashboardComponent {
  selectedRole: Role | null = null;

  goToDashboard() {
    if (this.selectedRole) {
      const routes: Record<Role, string> = {
        manager: '/manager/dashboard',
        driver: '/driver/login',
        customer: '/customer/dashboard'
      };

      this.router.navigate([routes[this.selectedRole]]);
    }
  }

  constructor(private router: Router) {}
}

