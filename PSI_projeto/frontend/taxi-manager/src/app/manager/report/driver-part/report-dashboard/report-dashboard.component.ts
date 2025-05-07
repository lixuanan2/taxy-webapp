/**
 * 📄 ReportDashboardComponent
 *
 * 本组件属于 Manager 模块，
 * 用于展示全局旅程统计总览，包括总旅程数、总小时数、总公里数，
 * 并支持跳转查看司机列表、出租车列表或旅程列表。
 *
 * 使用服务: ReportService
 *
 * 功能：
 * - 初始化 start(今天)和 end(明天)日期
 * - 根据时间范围查询整体统计数据
 * - 点击卡片跳转到对应的详细页面
 */

import { Component, OnInit } from '@angular/core';
import { ReportService } from '@shared/services/report/report.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-report-dashboard',
  templateUrl: './report-dashboard.component.html',
  styleUrls: ['./report-dashboard.component.css']
})
export class ReportDashboardComponent implements OnInit {

  // 📅 查询时间范围
  start: string;
  end: string;

  // 📊 总览统计数据
  totalTrips = 0;
  totalHours = 0;
  totalKm = 0;

  constructor(
    private reportService: ReportService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // ✨ 初始化 start 为今天, end 为明天
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    this.start = today.toISOString().slice(0, 10);
    this.end = tomorrow.toISOString().slice(0, 10);
  }

  // 🚀 组件初始化：解析 URL 参数并加载统计数据
  ngOnInit(): void {
    const urlStart = this.route.snapshot.queryParamMap.get('start');
    const urlEnd = this.route.snapshot.queryParamMap.get('end');

    if (urlStart) this.start = urlStart;
    if (urlEnd) this.end = urlEnd;

    this.loadAllStats();
  }

  // 📈 加载整体统计数据
  loadAllStats(): void {
    this.reportService.getOverallStats(this.start, this.end).subscribe(data => {
      this.totalTrips = data.totalTrips;
      this.totalHours = +data.totalHours.toFixed(2);
      this.totalKm = +data.totalKm.toFixed(2);
    });
  }

  // 📅 日期变化时重新加载数据
  onDateChange(): void {
    this.loadAllStats();
  }

  // ➡️ 跳转到司机列表
  goToDriverList(): void {
    this.router.navigate(['/manager/report/driver-list'], {
      queryParams: { start: this.start, end: this.end }
    });
  }

  // ➡️ 跳转到出租车列表
  goToTaxiList(): void {
    this.router.navigate(['/manager/report/taxi-list'], {
      queryParams: { start: this.start, end: this.end }
    });
  }

  // ➡️ 跳转到旅程列表
  goToTrip(): void {
    this.router.navigate(['/manager/report/trip'], {
      queryParams: { start: this.start, end: this.end }
    });
  }
}
