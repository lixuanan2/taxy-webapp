import { Component } from '@angular/core';
import { Driver } from '@models/driver.model';
import { DriverService } from '@services/driver.service';

@Component({
  selector: 'app-driver-form',
  templateUrl: './driver-form.component.html',
  styleUrls: ['./driver-form.component.css']
})
export class DriverFormComponent {
  currentYear = new Date().getFullYear();
  minBirthYear = this.currentYear - 100;
  maxBirthYear = this.currentYear - 18;

  // 初始化 driver 对象
  driver: Driver = this.createEmptyDriver();

  constructor(private driverService: DriverService) {}

  // 提交表单
  onSubmit() {
    this.driverService.createDriver(this.driver).subscribe({
      next: () => {
        alert('✅ Driver registered successfully!');
        this.driver = this.createEmptyDriver(); // 清空表单
      },
      error: err => {
        const msg = err.error?.message || err.message || 'Unknown error';
        if (msg.includes('nif')) {
          alert('🚫 NIF already exists!');
        } else if (msg.includes('licenseNumber')) {
          alert('🚫 License number already exists!');
        } else {
          alert('❌ Failed to register driver: ' + msg);
        }
      }
    });
  }

  // 工具方法：生成一个空的 driver 模板
  createEmptyDriver(): Driver {
    return {
      name: '',
      gender: 'male',
      birthYear: this.maxBirthYear,
      nif: '',
      licenseNumber: '',
      address: {
        street: '',
        number: '',
        postalCode: '',
        city: ''
      }
    };
  }
}
