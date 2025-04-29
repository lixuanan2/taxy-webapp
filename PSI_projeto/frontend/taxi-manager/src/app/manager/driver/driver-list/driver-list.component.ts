/**
 * 📄 DriverListComponent
 * 
 * 本组件属于 Manager 模块，
 * 用于展示所有司机(Driver)的列表信息，
 * 支持操作: 编辑(Edit)、删除(Delete)
 */

import { Component, OnInit } from '@angular/core';

// 🚗 模型
import { Driver } from '@models/driver.model';

// 🛠️ 服务
import { DriverService } from '@shared/services/driver/driver.service';

// 🚦 路由跳转
import { Router } from '@angular/router';

@Component({
  selector: 'app-driver-list',
  templateUrl: './driver-list.component.html',
  styleUrls: ['./driver-list.component.css']
})
export class DriverListComponent implements OnInit {

  // 🧑‍💼 当前的司机列表
  drivers: Driver[] = [];

  constructor(
    private driverService: DriverService,
    private router: Router
  ) {}

  // 🔄 页面初始化时拉取司机数据
  ngOnInit(): void {
    this.driverService.getDrivers().subscribe({
      next: (data) => this.drivers = data,
      error: (err) => console.error('Error fetching drivers:', err)
    });
  }

  // ✏️ 跳转到编辑司机页面（注意这里的 routerLink 直接写在按钮上了）
  onEdit(driver: Driver): void {
    this.router.navigate(['/manager/driver-form', driver.nif]);
  }

  // 🗑️ 删除司机
  onDelete(driver: Driver): void {
    if (confirm(`❗ Are you sure you want to delete driver ${driver.name}?`)) {
      this.driverService.deleteDriver(driver.nif).subscribe({
        next: () => {
          alert('✅ Driver deleted successfully!');
          this.refresh();
        },
        error: (err) => {
          alert('🚫 ' + (err.error?.message || 'Error deleting driver.'));
        }
      });
    }
  }

  // 🔄 刷新司机列表
  refresh(): void {
    this.driverService.getDrivers().subscribe({
      next: (data) => this.drivers = data,
      error: (err) => console.error('Error refreshing driver list:', err)
    });
  }
}
