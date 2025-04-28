/**
 * 📄 DashboardComponent
 * 
 * 本组件为 Manager Dashboard 页面，
 * 提供管理出租车(Taxi)、司机(Driver)、价格(Price)和报表(Reports)的入口。
 */

import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  // 目前本组件主要用于展示导航按钮，因此暂不包含业务逻辑
}
