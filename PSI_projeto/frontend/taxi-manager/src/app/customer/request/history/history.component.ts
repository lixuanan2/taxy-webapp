/**
 * 📄 HistoryComponent
 *
 * 本组件属于 Customer 模块，
 * 用于展示客户的叫车请求历史记录 (RideRequest)。
 *
 * 功能：
 * - 查询所有历史请求
 * - 特别处理状态：将后端返回的 "done" 状态统一显示为 "accepted"
 *
 * 使用服务：
 * - RequestService (调用 /api/request/history 接口)
 */

import { Component, OnInit } from '@angular/core';
import { RequestService } from '@shared/services/request/request.service';
import { RideRequest } from '@shared/models/ride-request.model';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  // 📚 存放历史请求记录
  requests: RideRequest[] = [];

  // 🛠️ 注入 RequestService
  constructor(private requestService: RequestService) {}

  // 🚀 生命周期钩子：页面初始化时加载历史数据
  ngOnInit(): void {
    this.requestService.getAllRequests().subscribe({
      next: (data) => {
        // 💡 特殊处理：
        // 如果后端返回的 status 是 "done"，则前端统一映射为 "accepted"
        this.requests = data.map(req => ({
          ...req,
          status: req.status === 'done' ? 'accepted' : req.status
        }));
      },
      error: (err) => {
        console.error('❌ Failed to fetch request history:', err);
      }
    });
  }
}
