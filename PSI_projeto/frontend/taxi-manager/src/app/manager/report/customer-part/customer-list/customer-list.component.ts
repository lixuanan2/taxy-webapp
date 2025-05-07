/**
 * 📄 CustomerListComponent
 *
 * 本组件属于 Manager 模块，
 * 用于展示所有客户(Customer)的统计汇总信息，
 * 并支持跳转查看单个客户的旅程明细。
 *
 * 使用服务: ReportService
 *
 * 功能：
 * - 按时间段加载客户统计数据
 * - 支持跳转查看单个客户的详细旅程
 * - 支持返回到总览页
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportService } from '@shared/services/report/report.service';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {

  // 📅 查询起止时间
  start: string = '';
  end: string = '';

  // 📋 客户统计列表
  customerStats: any[] = [];

  constructor(
    private reportService: ReportService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  // 🚀 组件初始化：读取时间参数并加载客户统计
  ngOnInit(): void {
    this.start = this.route.snapshot.queryParamMap.get('start') || '';
    this.end = this.route.snapshot.queryParamMap.get('end') || '';

    this.reportService.getCustomerStats(this.start, this.end).subscribe(stats => {
      this.customerStats = stats;
    });
  }

  // 📌 跳转到指定客户的旅程明细页
  goToCustomerDetail(nif: string): void {
    this.router.navigate(['/manager/customer-report/customer-detail', nif], {
      queryParams: { start: this.start, end: this.end }
    });
  }

  // ⬅️ 返回到 Customer Report Dashboard
  goBack(): void {
    this.router.navigate(['/manager/customer-report'], {
      queryParams: { start: this.start, end: this.end }
    });
  }
}
