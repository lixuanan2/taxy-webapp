/**
 * 📄 TripListComponent
 *
 * 本组件用于展示司机已登记的所有旅程 (Trip),
 * 默认按起始时间 (startTime) 降序排列显示。
 *
 * 使用场景: Driver 模块 - Trip List 页面 (driver/trip/list)
 */

import { Component, OnInit } from '@angular/core';
import { TripService } from '@shared/services/trip/trip.service';
import { Trip } from '@models/trip.model';

@Component({
  selector: 'app-trip-list',
  templateUrl: './trip-list.component.html',
  styleUrls: ['./trip-list.component.css']
})
export class TripListComponent implements OnInit {
  trips: Trip[] = []; // 当前司机的所有旅程列表

  constructor(private tripService: TripService) {}

  // 📋 页面初始化
  ngOnInit(): void {
    this.tripService.getAllTrips().subscribe({
      next: (data) => {
        // ✅ 按 startTime 降序排列
        this.trips = data.sort((a, b) =>
          new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
        );
      },
      error: (err) => {
        console.error('❌ Failed to load trips:', err);
      }
    });
  }
}
