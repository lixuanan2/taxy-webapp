/**
 * 📄 TaxiDetailComponent
 *
 * 本组件属于 Manager 模块，
 * 用于展示单辆出租车 (Taxi) 在选定时间段内的所有旅程 (Trip) 详情。
 *
 * 使用服务: ReportService
 *
 * 功能：
 * - 初始化时解析路由参数(plate、start、end)
 * - 查询指定出租车在时间范围内的旅程数据
 * - 支持返回到出租车统计列表页
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportService } from '@shared/services/report/report.service';

@Component({
  selector: 'app-taxi-detail',
  templateUrl: './taxi-detail.component.html',
  styleUrls: ['./taxi-detail.component.css']
})
export class TaxiDetailComponent implements OnInit {

  // 🚖 当前出租车的车牌号
  vehiclePlate: string = '';

  // 📅 查询时间范围
  start: string = '';
  end: string = '';

  // 📋 旅程列表
  trips: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private reportService: ReportService,
    private router: Router
  ) {}

  // 🚀 组件初始化：读取路由参数并加载旅程数据
  ngOnInit(): void {
    this.vehiclePlate = this.route.snapshot.paramMap.get('plate') || '';
    this.start = this.route.snapshot.queryParamMap.get('start') || '';
    this.end = this.route.snapshot.queryParamMap.get('end') || '';

    if (this.vehiclePlate) {
      this.loadTrips();
    }
  }

  // 📈 加载当前出租车的旅程数据
  loadTrips(): void {
    this.reportService.getTripsByTaxi(this.vehiclePlate, this.start, this.end).subscribe(data => {
      this.trips = data.map(t => ({
        ...t,
        durationHours: (new Date(t.endTime).getTime() - new Date(t.startTime).getTime()) / 3600000
      }));
    });
  }

  // ⬅️ 返回到出租车列表页
  goBack(): void {
    this.router.navigate(['/manager/report/taxi-list'], {
      queryParams: { start: this.start, end: this.end }
    });
  }
}
