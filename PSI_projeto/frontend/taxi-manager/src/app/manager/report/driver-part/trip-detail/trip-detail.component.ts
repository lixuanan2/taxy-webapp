/**
 * 📄 TripDetailComponent
 *
 * 本组件属于 Manager 模块，
 * 用于展示选定时间段内的全部旅程 (Trip) 详细信息，
 * 包括起止时间、持续时间、距离、司机与出发地/目的地等。
 *
 * 使用服务: ReportService
 *
 * 功能：
 * - 初始化时解析路由参数（start、end）
 * - 查询旅程列表
 * - 支持计算每条旅程的持续时间 (Duration)
 * - 支持根据来源页面灵活返回（Report 或 Customer Report）
 */

import { Component, OnInit } from '@angular/core';
import { Trip } from '@models/trip.model';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ReportService } from '@shared/services/report/report.service';

@Component({
  selector: 'app-trip-detail',
  templateUrl: './trip-detail.component.html',
  styleUrls: ['./trip-detail.component.css']
})
export class TripDetailComponent implements OnInit {

  // 📅 查询时间范围
  start: string = '';
  end: string = '';

  // 🚖 旅程列表
  trips: Trip[] = [];

  constructor(
    private reportService: ReportService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  // 🚀 组件初始化：读取时间参数并加载旅程列表
  ngOnInit(): void {
    this.start = this.route.snapshot.queryParamMap.get('start') || '';
    this.end = this.route.snapshot.queryParamMap.get('end') || '';

    this.reportService.getTrips(this.start, this.end).subscribe({
      next: data => this.trips = data,
      error: err => console.error('❌ Failed to fetch trips', err)
    });
  }

  // ⏳ 计算旅程的持续时间（小时数）
  getDuration(t: Trip): string {
    const start = new Date(t.startTime);
    const end = new Date(t.endTime);
    const duration = (end.getTime() - start.getTime()) / 3600000;
    return duration.toFixed(2);
  }

  // ⬅️ 返回到上一级页面（动态判断来源）
  goBack(): void {
    const basePath = this.router.url.includes('customer-report')
      ? '/manager/customer-report'
      : '/manager/report';

    this.router.navigate([basePath], {
      queryParams: { start: this.start, end: this.end }
    });
  }

}
