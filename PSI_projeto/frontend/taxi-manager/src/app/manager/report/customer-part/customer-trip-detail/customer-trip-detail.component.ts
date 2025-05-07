/**
 * 📄 CustomerTripDetailComponent
 *
 * 本组件属于 Manager 模块，
 * 用于展示指定时间段内所有客户(Customer)的旅程明细(Trip),
 * 主要根据旅程的创建时间(createdAt)进行筛选。
 *
 * 使用服务: ReportService
 *
 * 功能：
 * - 加载指定时间段内的所有旅程
 * - 计算每条旅程的持续时间(Duration)
 * - 支持返回到 Customer Report Dashboard
 */

import { Component, OnInit } from '@angular/core';
import { Trip } from '@models/trip.model';
import { Router, ActivatedRoute } from '@angular/router';
import { ReportService } from '@shared/services/report/report.service';

@Component({
  selector: 'app-customer-trip-detail',
  templateUrl: './customer-trip-detail.component.html',
  styleUrls: ['./customer-trip-detail.component.css']
})
export class CustomerTripDetailComponent implements OnInit {

  // 📋 旅程列表
  trips: Trip[] = [];

  // 📅 查询起止时间
  start: string = '';
  end: string = '';

  constructor(
    private reportService: ReportService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  // 🚀 组件初始化：加载所有客户旅程
  ngOnInit(): void {
    this.start = this.route.snapshot.queryParamMap.get('start') || '';
    this.end = this.route.snapshot.queryParamMap.get('end') || '';

    this.reportService.getTripsByCreatedAt(this.start, this.end).subscribe({
      next: data => this.trips = data,
      error: err => console.error('❌ Failed to fetch trips (createdAt):', err)
    });
  }

  // 🕒 计算旅程时长 (小时，保留两位小数)
  getDuration(t: Trip): string {
    const start = new Date(t.startTime);
    const end = new Date(t.endTime);
    const duration = (end.getTime() - start.getTime()) / 3600000;
    return duration.toFixed(2);
  }

  // ⬅️ 返回到 Customer Report Dashboard
  goBack(): void {
    this.router.navigate(['/manager/customer-report'], {
      queryParams: { start: this.start, end: this.end }
    });
  }
}
