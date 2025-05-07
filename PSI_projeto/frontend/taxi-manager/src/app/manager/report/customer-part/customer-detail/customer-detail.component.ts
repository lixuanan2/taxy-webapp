/**
 * 📄 CustomerDetailComponent
 *
 * 本组件属于 Manager 模块，
 * 用于展示单个客户(Customer)在选定时间段内的旅程(Trip)明细。
 *
 * 使用服务: ReportService
 *
 * 功能：
 * - 查询某个客户的所有旅程(基于 createdAt)
 * - 支持带查询参数(start, end)返回上一级
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportService } from '@shared/services/report/report.service';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.css']
})
export class CustomerDetailComponent implements OnInit {

  // 🆔 当前客户的 NIF
  clientNIF: string = '';

  // 📋 当前客户的旅程列表
  trips: any[] = [];

  // 📅 查询起止时间
  start: string = '';
  end: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reportService: ReportService
  ) {}

  // 🚀 组件初始化：读取路由参数并加载旅程
  ngOnInit(): void {
    this.clientNIF = this.route.snapshot.paramMap.get('nif') || '';
    this.start = this.route.snapshot.queryParamMap.get('start') || '';
    this.end = this.route.snapshot.queryParamMap.get('end') || '';

    if (this.clientNIF) {
      this.reportService.getTripsByClientCreatedAt(this.clientNIF, this.start, this.end).subscribe(trips => {
        this.trips = trips;
      });
    }
  }

  // ⬅️ 返回到客户列表页面
  goBack(): void {
    this.router.navigate(['/manager/customer-report/customer-list'], {
      queryParams: { start: this.start, end: this.end }
    });
  }
}
