/**
 * 📄 DriverDashboardComponent
 *
 * 本组件属于 Driver 模块，
 * 用于展示司机登录后的主控制台页面，包括：
 * - Turn、Trip、Invoice 管理快捷入口
 * - 状态提醒（如是否有待处理的 Trip）
 * - 客户确认请求的轮询检查
 *
 * 使用服务：
 * - InvoiceService (查询发票)
 * - DriverAuthService (处理登录身份)
 * - RequestService (查询叫车请求状态)
 */

import { Component, OnInit } from '@angular/core';

// 🛠️ 服务
import { InvoiceService } from '@shared/services/invoice/invoice.service';
import { DriverAuthService } from '@shared/services/driver-auth/driver-auth.service';
import { RequestService } from '@shared/services/request/request.service';

// 🌐 路由
import { Router } from '@angular/router';

@Component({
  selector: 'app-driver-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // 📋 页面显示需要用到的数据
  driverName = localStorage.getItem('currentDriverName') || '';
  hasPendingTrip = false;    // 是否有待注册的 Trip
  invoicesCount: number = 0; // 已开具的发票数量
  waitingForClient = false;  // 是否正在等待客户确认
  rejectedByClient = false;  // 是否被客户拒绝

  // 🛠️ 构造函数注入所需服务
  constructor(
    private requestService: RequestService,
    private invoiceService: InvoiceService,
    private authService: DriverAuthService,
    private router: Router
  ) {}

  // 🚀 页面初始化
  ngOnInit(): void {
    this.checkForPendingTrip();
    this.loadInvoices();

    // 若有等待客户确认的请求，启动轮询
    const pendingId = localStorage.getItem('latestRequestId');
    if (pendingId) {
      this.waitingForClient = true;
      this.waitForClientConfirmation(pendingId);
    }
  }

  // 🔒 登出逻辑
  logout() {
    this.authService.logout();
    this.router.navigate(['/driver/login']);
  }

  // 🔍 检查是否有未注册的 Trip
  checkForPendingTrip() {
    const driverName = localStorage.getItem('currentDriverName') || '';
    const latestRequest = localStorage.getItem('latestRequest');

    if (!latestRequest) {
      this.hasPendingTrip = false;
      return;
    }

    const req = JSON.parse(latestRequest);

    this.requestService.getRequestStatus(req._id).subscribe({
      next: fresh => {
        if (fresh.status === 'rejected' || fresh.status === 'cancelled' || fresh.status === 'done') {
          // ❌ 被拒绝、取消或已完成，清除本地存储
          localStorage.removeItem('latestRequest');
          this.hasPendingTrip = false;
          return;
        }

        if (fresh.status === 'accepted' && fresh.confirmedByClient) {
          // ✅ 已被接受且客户确认
          this.hasPendingTrip = true;
        } else {
          // ⛔ 尚未确认
          this.hasPendingTrip = false;
        }
      },
      error: err => {
        console.warn('⚠️ Failed to check accepted requests:', err);
        this.hasPendingTrip = false;
      }
    });
  }

  // 🧾 加载当前司机的发票数量
  loadInvoices() {
    const driverName = localStorage.getItem('currentDriverName') || '';
    this.invoiceService.getInvoicesByDriver(driverName).subscribe({
      next: invoices => {
        this.invoicesCount = invoices.length;
      },
      error: err => {
        console.error('❌ Failed to load invoices:', err);
      }
    });
  }

  waitInterval: any; // 保存轮询定时器ID

  // ⏳ 轮询等待客户确认
  waitForClientConfirmation(requestId: string): void {
    this.waitInterval = setInterval(() => {
      this.requestService.getRequestStatus(requestId).subscribe({
        next: (fresh) => {
          if (fresh.status === 'rejected' || fresh.status === 'cancelled') {
            // ❌ 客户拒绝或取消
            localStorage.removeItem('latestRequest');
            localStorage.removeItem('latestRequestId');
            this.rejectedByClient = true;
            this.hasPendingTrip = false;
            this.waitingForClient = false;
            clearInterval(this.waitInterval);
          } else if (fresh.confirmedByClient) {
            // ✅ 客户确认成功
            this.hasPendingTrip = true;
            this.waitingForClient = false;
            localStorage.removeItem('latestRequestId');
            clearInterval(this.waitInterval);
          }
        },
        error: (err) => {
          console.error('❌ Error checking client confirmation:', err);
          if (err.status === 404) {
            clearInterval(this.waitInterval);
            localStorage.removeItem('latestRequestId');
            this.waitingForClient = false;
            alert('❌ The request was removed or no longer exists.');
          }
        }
      });
    }, 3000); // 每3秒查询一次
  }

  // 🚫 用户点击关闭被拒绝提示框
  dismissRejectionAlert(): void {
    this.rejectedByClient = false;
  }
}
