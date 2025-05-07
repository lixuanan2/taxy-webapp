/**
 * 📄 DriverDetailComponent
 *
 * 本组件属于 Manager 模块，
 * 用于展示指定司机 (Driver) 在选定时间范围内的旅程 (Trip) 列表，
 * 包括起止时间、行驶公里数、出发地、目的地等。
 *
 * 使用服务: ReportService
 *
 * 功能：
 * - 根据路由参数 driverName、start、end 加载司机对应旅程
 * - 计算每次旅程的持续时长 (小时)
 * - 支持返回至司机列表页面
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportService } from '@shared/services/report/report.service';

@Component({
  selector: 'app-driver-detail',
  templateUrl: './driver-detail.component.html',
  styleUrls: ['./driver-detail.component.css']
})
export class DriverDetailComponent implements OnInit {

  // 🧑 司机信息
  driverName: string = '';

  // 📅 查询时间范围
  start: string = '';
  end: string = '';

  // 📋 旅程列表
  trips: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reportService: ReportService
  ) {}

  // 🚀 组件初始化：解析 URL 参数并加载旅程
  ngOnInit(): void {
    this.driverName = this.route.snapshot.paramMap.get('name') || '';
    this.start = this.route.snapshot.queryParamMap.get('start') || '';
    this.end = this.route.snapshot.queryParamMap.get('end') || '';

    if (this.driverName) {
      this.loadTrips();
    }
  }

  // 🔄 加载司机的旅程数据
  loadTrips(): void {
    this.reportService.getTripsByDriver(this.driverName, this.start, this.end).subscribe(data => {
      this.trips = data.map(t => ({
        ...t,
        durationHours: (new Date(t.endTime).getTime() - new Date(t.startTime).getTime()) / 3600000
      }));
    });
  }

  // ⬅️ 返回到司机列表
  goBack(): void {
    this.router.navigate(['/manager/report/driver-list'], {
      queryParams: { start: this.start, end: this.end }
    });
  }
}
