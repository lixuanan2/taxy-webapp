/**
 * 📄 RequestListComponent
 *
 * 本组件用于司机查看所有待接单的叫车请求，
 * 支持接单 (Accept) 与拒单 (Reject) 操作，
 * 接单后跳转回司机 Dashboard 页面。
 *
 * 使用场景: Driver 模块 - Request List 页面 (driver/request/list)
 */

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// 🚗 模型
import { RideRequest } from '@models/ride-request.model';

// 🚗 服务
import { TurnService } from '@shared/services/turn/turn.service';
import { RequestService } from '@shared/services/request/request.service';

@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.css']
})
export class RequestListComponent implements OnInit {
  requests: RideRequest[] = []; // 所有待接单请求
  loading = true;               // 加载状态
  driverNIF = '';                // 当前司机 NIF
  driverLat = 0;
  driverLon = 0;
  driverComfort: 'basic' | 'luxury' = 'basic';

  constructor(
    private requestService: RequestService,
    private turnService: TurnService,
    private router: Router
  ) {}

  // 📋 初始化页面
  ngOnInit(): void {
    // ✅ 从 localStorage 获取当前登录司机的 NIF
    this.driverNIF = localStorage.getItem('currentDriverNif') || '';
    this.driverLat = parseFloat(localStorage.getItem('currentDriverLat') || '0'); // ✅ 从 localStorage 获取司机坐标
    this.driverLon = parseFloat(localStorage.getItem('currentDriverLon') || '0');
    this.driverComfort = (localStorage.getItem('currentDriverComfort') as 'basic' | 'luxury') || 'basic';
    this.loadRequests();
  }

  // 📡 加载所有待接单请求
  loadRequests(): void {
    this.loading = true;
    this.requestService.getPendingRequests(this.driverLat, this.driverLon).subscribe({
      next: (data) => {
        this.requests = data
          .filter(r => r.status === 'pending' && !r.driverNIF);
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Failed to fetch requests:', err);
        this.loading = false;
      }
    });
  }


  // ✅ 接受一个请求 (无需判断 active turn, 只判断是否存在 turn)
  accept(requestId: string): void {
    if (!this.driverNIF) {
      alert('⚠️ Driver NIF not available.');
      return;
    }

    this.turnService.getTurnsByDriver(this.driverNIF).subscribe({
      next: (turns) => {
        if (!turns || turns.length === 0) {
          alert('🚫 You must have at least one turn to accept requests.');
          return;
        }

        if (!this.canAcceptRequest(requestId)) {
          alert('🚫 Comfort level mismatch.');
          return;
        }

        this.requestService.acceptRequest(requestId, this.driverNIF).subscribe({
          next: () => {
            alert('✅ Request accepted successfully!');
            localStorage.setItem('latestRequestId', requestId);
            this.router.navigate(['/driver/dashboard']);
          },
          error: (err) => {
            alert('❌ Failed to accept the request.');
            console.error(err);
          }
        });
      },
      error: (err) => {
        console.error('❌ Failed to fetch turns:', err);
        alert('❌ Error checking turn. Please try again.');
      }
    });
  }

  // ❌ 拒绝一个请求
  reject(requestId: string): void {
    this.requestService.rejectRequest(requestId).subscribe({
      next: () => {
        alert('🚫 Request rejected.');
        this.loadRequests(); // 重新加载请求列表
      },
      error: (err) => {
        alert('❌ Failed to reject the request.');
        console.error(err);
      }
    });
  }

  // 🕒 根据起点和终点计算预计行程时间 (分钟)
  getEstimatedTime(req: RideRequest): string {
    if (!req.currentLat || !req.currentLon || !req.destLat || !req.destLon) return '—';

    const distanceKm = this.haversineKm(
      req.currentLat, req.currentLon,
      req.destLat, req.destLon
    );

    const speedKmh = 30; // 预设平均速度: 30km/h
    const timeMin = Math.round((distanceKm / speedKmh) * 60);
    return `${timeMin} min`;
  }

  // 📏 计算两点间的 Haversine 距离 (km)
  haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // 地球半径 (km)
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // 🔍 检查司机是否满足乘客要求的舒适度
  canAccept(req: RideRequest): boolean {
    return this.driverComfort === req.comfortLevel;
  }

  // 🔍 从请求列表中查找对应请求并检查舒适度
  canAcceptRequest(requestId: string): boolean {
    const req = this.requests.find(r => r._id === requestId);
    if (!req) return false;
    return this.canAccept(req);
  }

}
