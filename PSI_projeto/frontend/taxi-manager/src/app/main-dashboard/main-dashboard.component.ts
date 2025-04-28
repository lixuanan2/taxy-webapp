/**
 * 📄 MainDashboardComponent
 * 
 * 本组件为系统的入口页(Main Dashboard),
 * 允许用户选择自己的角色(manager / driver / customer),
 * 并跳转到各自对应的 dashboard 页面。
 */

import { Component } from '@angular/core';
import { Router } from '@angular/router';

// 🌟 定义角色类型
type Role = 'manager' | 'driver' | 'customer';

@Component({
  selector: 'app-main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.css']
})

export class MainDashboardComponent {
  // 当前选中的角色
  selectedRole: Role | null = null;

  // 🚀 跳转到对应角色的 dashboard 页面
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

  // 注入 Router 用于页面跳转
  constructor(private router: Router) {}
}
