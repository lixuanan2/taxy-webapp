/**
 * 📄 DriverFormComponent
 * 
 * 本组件属于 Manager 模块，
 * 用于注册新司机(Driver),填写个人资料与地址信息,
 * 并支持从地图上选择地理位置自动补充地址。
 */

import { Component } from '@angular/core';

// 🚗 模型
import { Driver } from '@models/driver.model';

// 🛠️ 服务
import { DriverService } from '@shared/services/driver/driver.service';
import { ApiService } from '@shared/services/api/api.service';

// 🌐 HTTP 处理
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-driver-form',
  templateUrl: './driver-form.component.html',
  styleUrls: ['./driver-form.component.css']
})
export class DriverFormComponent {
  currentYear = new Date().getFullYear();
  minBirthYear = this.currentYear - 100;
  maxBirthYear = this.currentYear - 18;

  // 🧑 当前表单的 driver 对象
  driver: Driver = this.createEmptyDriver();

  constructor(
    private driverService: DriverService,
    private apiService: ApiService,
    private http: HttpClient
  ) {}

  // 📝 提交注册司机
  onSubmit(): void {
    this.driverService.createDriver(this.driver).subscribe({
      next: () => {
        alert('✅ Driver registered successfully!');
        this.driver = this.createEmptyDriver();
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

  // 🛠️ 工具方法：生成一个空的 driver
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
      },
      lat: undefined,
      lon: undefined
    };
  }

  // 📬 根据邮政编码自动填充城市
  onPostalCodeBlur(postalCode: string): void {
    this.apiService.lookupPostalCode(postalCode).subscribe({
      next: cityData => {
        this.driver.address.city = cityData.city;
      },
      error: err => {
        console.error('Error fetching city:', err);
        alert('❌ Failed to fetch city for the postal code.');
      }
    });
  }

  // 🗺️ 地图选点回调，自动补充地理信息
  onMapSelected(event: { lat: number, lon: number }): void {
    this.driver.lat = event.lat;
    this.driver.lon = event.lon;

    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${event.lat}&lon=${event.lon}`;
    this.http.get<any>(url).subscribe({
      next: data => {
        const address = data.address;
        this.driver.address.city = address.city || address.town || address.village || '';
        this.driver.address.street = address.road || '';
        this.driver.address.postalCode = address.postcode || '';
      },
      error: err => {
        console.error('Reverse geocode failed:', err);
        alert('❌ Failed to get address from the map.');
      }
    });
  }
}
