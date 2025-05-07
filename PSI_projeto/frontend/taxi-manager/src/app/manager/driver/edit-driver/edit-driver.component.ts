/**
 * ✏️ EditDriverComponent
 *
 * 本组件属于 Manager 模块，
 * 用于编辑现有司机 (Driver) 的信息，
 * 包括个人资料与地址更新，并校验年龄范围。
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DriverService } from '@shared/services/driver/driver.service';
import { Driver } from '@models/driver.model';

@Component({
  selector: 'app-edit-driver',
  templateUrl: './edit-driver.component.html',
  styleUrls: ['./edit-driver.component.css']
})
export class EditDriverComponent implements OnInit {
  // 🧑 当前编辑的 driver 对象
  driver: Driver = {
    name: '',
    gender: 'male',
    birthYear: 2000,
    nif: '',
    licenseNumber: '',
    address: {
      street: '',
      number: '',
      postalCode: '',
      city: ''
    }
  };

  // 📅 年份范围控制（用于限制出生年份）
  currentYear = new Date().getFullYear();
  minBirthYear = this.currentYear - 100;
  maxBirthYear = this.currentYear - 18;

  constructor(
    private route: ActivatedRoute,
    private driverService: DriverService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const nif = this.route.snapshot.paramMap.get('nif');
    if (!nif) return;

    this.driverService.getDriverByNif(nif).subscribe({
      next: (data) => this.driver = data,
      error: (err) => {
        alert('❌ Failed to load driver data.');
        this.router.navigate(['/manager/driver/driver-list']);
      }
    });
  }

  // 💾 提交更新司机信息
  onSubmit(): void {
    this.driverService.updateDriver(this.driver.nif, this.driver).subscribe({
      next: () => {
        alert('✅ Driver updated successfully!');
        this.router.navigate(['/manager/driver/driver-list']);
      },
      error: err => {
        alert('❌ Failed to update driver.');
        console.error(err);
      }
    });
  }
}
