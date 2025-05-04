/**
 * 📄 DriverLoginComponent
 *
 * 本组件属于 Driver 模块，
 * 用于司机登录系统，通过选择 NIF 或输入 NIF 验证身份，
 * 登录成功后保存至 localStorage 并跳转至司机 Dashboard。
 *
 * 使用场景: Driver 登录页面 (driver/login)
 */

// 🛠️ 服务
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// 🚗 模型
import { Driver } from '@models/driver.model';

// 🔌 服务
import { DriverService } from '@shared/services/driver/driver.service';
import { DriverAuthService } from '@shared/services/driver-auth/driver-auth.service';

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

  // 📋 初始化：加载所有司机信息
  ngOnInit(): void {
    this.driverService.getDrivers().subscribe({
      next: data => this.drivers = data,
      error: err => console.error('❌ Failed to fetch drivers:', err)
    });
  }

  // 🚀 登录按钮点击：验证 NIF 并保存到本地
  onLogin(): void {
    const found = this.drivers.find(d => d.nif === this.selectedNif);

    if (found) {
      this.authService.login(found);

      // 保存当前司机到 localStorage
      localStorage.setItem('currentDriverName', found.name);
      localStorage.setItem('currentDriverNif', found.nif);

      // 跳转至司机 Dashboard
      this.router.navigate(['/driver/dashboard']);
    } else {
      this.errorMsg = '❌ Invalid NIF. Please try again.'; // 已统一为英文提示
    }
  }
}
