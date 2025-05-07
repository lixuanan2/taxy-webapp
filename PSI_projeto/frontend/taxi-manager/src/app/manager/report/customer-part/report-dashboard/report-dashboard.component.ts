/**
 * 📄 CustomerReportDashboardComponent
 *
 * 本组件属于 Manager 模块，
 * 用于展示客户(Customer)相关的旅程(Trip)与财务统计总览，
 * 包括总金额、旅程数量、客户数量等。
 *
 * 使用服务: ReportService
 *
 * 功能：
 * - 初始化默认日期：今天(start) ➔ 明天(end)
 * - 加载客户总览统计、客户列表统计、旅程列表统计
 * - 支持切换日期区间
 * - 支持跳转到客户列表或旅程明细页面
 */

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ReportService } from '@shared/services/report/report.service';

@Component({
  selector: 'app-customer-report-dashboard',
  templateUrl: './report-dashboard.component.html',
  styleUrls: ['./report-dashboard.component.css']
})
export class CustomerReportDashboardComponent implements OnInit {

  // 📅 查询时间范围
  start: string;
  end: string;

  // 📊 总览数据
  totalAmount = 0;
  totalTrips = 0;
  totalClients = 0;

  // 📋 列表数据
  customerStats: any[] = [];
  tripStats: any[] = [];

  constructor(
    private reportService: ReportService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // ✨ 初始化默认日期: start = 今天, end = 明天
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    this.start = today.toISOString().slice(0, 10);
    this.end = tomorrow.toISOString().slice(0, 10);
  }

  // 🚀 组件初始化：加载数据
  ngOnInit(): void {
    const queryStart = this.route.snapshot.queryParamMap.get('start');
    const queryEnd = this.route.snapshot.queryParamMap.get('end');

    if (queryStart) this.start = queryStart;
    if (queryEnd) this.end = queryEnd;

    this.loadAllStats();
  }

  // 🔄 加载所有统计数据
  loadAllStats(): void {
    this.reportService.getCustomerOverallStats(this.start, this.end).subscribe(data => {
      this.totalAmount = data.totalAmount;
      this.totalTrips = data.totalTrips;
      this.totalClients = data.totalClients;
    });

    this.reportService.getCustomerStats(this.start, this.end).subscribe(data => {
      this.customerStats = data;
    });

    this.reportService.getTripStats(this.start, this.end).subscribe(data => {
      this.tripStats = data;
    });
  }

  // 📅 日期变动时刷新数据
  onDateChange(): void {
    this.loadAllStats();
  }

  // 🚗 跳转到旅程明细页
  goToTrip(): void {
    this.router.navigate(['/manager/customer-report/trip'], {
      queryParams: { start: this.start, end: this.end }
    });
  }

  // 👤 跳转到客户列表页
  goToCustomerList(): void {
    this.router.navigate(['/manager/customer-report/customer-list'], {
      queryParams: { start: this.start, end: this.end }
    });
  }
}
