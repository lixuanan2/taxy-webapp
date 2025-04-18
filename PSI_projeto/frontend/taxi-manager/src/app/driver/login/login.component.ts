import { Component, OnInit } from '@angular/core';
import { DriverService } from '@services/driver.service';
import { Driver } from '@models/driver.model';
import { Router } from '@angular/router';
import { DriverAuthService } from '@services/driver-auth.service';

@Component({
  selector: 'app-driver-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class DriverLoginComponent implements OnInit {
  drivers: Driver[] = [];
  selectedNif: string = '';
  errorMsg: string = '';

  constructor(
    private driverService: DriverService,
    private authService: DriverAuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.driverService.getDrivers().subscribe({
      next: data => this.drivers = data,
      error: err => console.error('❌ Failed to fetch drivers:', err)
    });
  }

  onLogin() {
    const found = this.drivers.find(d => d.nif === this.selectedNif);
    if (found) {
      this.authService.login(found);
  
      // 保存司机信息到 localStorage
      localStorage.setItem('currentDriverName', found.name);  // 可换成 found.id 等字段
      localStorage.setItem('currentDriverNif', found.nif);
  
      this.router.navigate(['/driver/dashboard']);
    } else {
      this.errorMsg = '❌ Invalid NIF. Please try again.';
    }
  }
  
}
