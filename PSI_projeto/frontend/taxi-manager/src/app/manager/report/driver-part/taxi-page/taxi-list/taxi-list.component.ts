/**
 * 📄 TaxiListComponent
 *
 * 本组件属于 Manager 模块，
 * 用于展示所有出租车 (Taxi) 在选定时间段内的统计信息，包括总小时数和总公里数。
 *
 * 使用服务: ReportService
 *
 * 功能：
 * - 初始化时解析路由参数 (start、end)
 * - 查询出租车统计列表
 * - 支持跳转到单辆出租车的详细旅程页
 * - 支持返回到 Trip 报告总览页
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportService } from '@shared/services/report/report.service';

@Component({
  selector: 'app-taxi-list',
  templateUrl: './taxi-list.component.html',
  styleUrls: ['./taxi-list.component.css']
})
export class TaxiListComponent implements OnInit {

  // 📅 查询时间范围
  start: string = '';
  end: string = '';

  // 🚕 出租车统计数据
  taxiStats: any[] = [];

  constructor(
    private reportService: ReportService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  // 🚀 组件初始化：读取时间参数并加载出租车数据
  ngOnInit(): void {
    this.start = this.route.snapshot.queryParamMap.get('start') || '';
    this.end = this.route.snapshot.queryParamMap.get('end') || '';

    this.reportService.getTaxiStats(this.start, this.end).subscribe(data => {
      this.taxiStats = data;
    });
  }

  // ➡️ 跳转到单个出租车详情页
  goToTaxiDetail(plate: string): void {
    this.router.navigate(['/manager/report/taxi', plate], {
      queryParams: { start: this.start, end: this.end }
    });
  }

  // ⬅️ 返回到 Trip 报告首页
  goBack(): void {
    this.router.navigate(['/manager/report'], {
      queryParams: { start: this.start, end: this.end }
    });
  }
}
