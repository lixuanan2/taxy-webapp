/**
 * 📄 DriverListComponent
 *
 * 本组件属于 Manager 模块，
 * 用于展示在指定时间范围内各司机 (Driver) 的行驶小时数与公里数总览，
 * 并支持跳转查看单个司机的旅程明细。
 *
 * 使用服务: ReportService
 *
 * 功能：
 * - 根据 start 和 end 查询司机统计数据
 * - 点击表格跳转到指定司机的旅程详情页
 * - 支持返回至统计仪表盘
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportService } from '@shared/services/report/report.service';

@Component({
  selector: 'app-driver-list',
  templateUrl: './driver-list.component.html',
  styleUrls: ['./driver-list.component.css']
})
export class DriverListComponent implements OnInit {

  // 📅 查询时间范围
  start: string = '';
  end: string = '';

  // 📋 司机统计数据列表
  driverStats: any[] = [];

  constructor(
    private reportService: ReportService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  // 🚀 组件初始化：解析 URL 参数并加载司机统计数据
  ngOnInit(): void {
    this.start = this.route.snapshot.queryParamMap.get('start') || '';
    this.end = this.route.snapshot.queryParamMap.get('end') || '';

    this.reportService.getDriverStats(this.start, this.end).subscribe(data => {
      this.driverStats = data;
    });
  }

  // 📄 跳转到指定司机的旅程详情页面
  goToDriverDetail(name: string): void {
    this.router.navigate(['/manager/report/driver', name], {
      queryParams: { start: this.start, end: this.end }
    });
  }

  // ⬅️ 返回到 Report 仪表盘
  goBack(): void {
    this.router.navigate(['/manager/report'], {
      queryParams: { start: this.start, end: this.end }
    });
  }
}
