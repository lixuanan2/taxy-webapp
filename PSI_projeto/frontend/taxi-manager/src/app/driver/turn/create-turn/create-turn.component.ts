/**
 * 📄 CreateTurnComponent
 *
 * 本组件属于 Driver 模块，
 * 允许司机（Driver）选择开始和结束时间，
 * 并基于可用性选择出租车 (Taxi) 创建一个新的 Turn（工作班次）。
 */

import { Component, OnInit } from '@angular/core';

// 🛠️ 服务
import { TurnService } from '@shared/services/turn/turn.service';
import { DriverAuthService } from '@shared/services/driver-auth/driver-auth.service';

@Component({
  selector: 'app-create-turn',
  templateUrl: './create-turn.component.html',
  styleUrls: ['./create-turn.component.css']
})
export class CreateTurnComponent implements OnInit {
  // 🔑 当前登录司机的 NIF
  driverNIF: string = '';

  // ⏰ 选择的开始与结束时间（表单绑定）
  startTime: string = '';
  endTime: string = '';

  // 🚖 可用出租车列表
  availableTaxis: any[] = [];

  // 🚕 当前选择的出租车车牌
  selectedTaxiPlate: string = '';

  constructor(
    private turnService: TurnService,
    private authService: DriverAuthService
  ) {}

  ngOnInit(): void {
    // 🧑 获取当前登录司机信息
    const driver = this.authService.getCurrentDriver();
    if (driver) {
      this.driverNIF = driver.nif;
    } else {
      alert('🚫 Error: Driver not authenticated!');
    }

    // 🕒 定时检查时间变化，自动加载出租车（每0.5秒）
    setInterval(() => {
      if (this.startTime && this.endTime) {
        this.tryAutoLoadTaxis();
      }
    }, 500);
  }

  // 🧠 避免重复请求，只有时间变化时才触发
  lastStart = '';
  lastEnd = '';
  tryAutoLoadTaxis() {
    if (this.startTime === this.lastStart && this.endTime === this.lastEnd) return;

    this.lastStart = this.startTime;
    this.lastEnd = this.endTime;
    this.onCheckAvailable();
  }

  // 🚖 查询可用出租车
  onCheckAvailable() {
    const startDate = this.getTodayTime(this.startTime);
    const endDate = this.getTodayTime(this.endTime);

    // 🕛 如果跨天，则自动加一天
    if (endDate <= startDate) {
      endDate.setDate(endDate.getDate() + 1);
    }

    const duration = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
    if (duration > 8) {
      alert('⏳ Duration must not exceed 8 hours.');
      return;
    }

    this.turnService.getAvailableTaxis(startDate, endDate).subscribe({
      next: (data) => {
        this.availableTaxis = data;
      },
      error: (err) => {
        alert('❌ Failed to fetch available taxis');
        console.error(err);
      }
    });
  }

  // 📝 提交新 Turn
  onSubmit() {
    if (!this.selectedTaxiPlate) {
      alert('🚕 Please select a taxi!');
      return;
    }

    const now = new Date();
    const start = this.getTodayTime(this.startTime);
    const end = this.getTodayTime(this.endTime);
    const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

    if (start < now) {
      alert('⏰ Start time must be after current time.');
      return;
    }

    if (durationHours > 8) {
      alert('⏳ Turn duration must not exceed 8 hours.');
      return;
    }

    const newTurn = {
      driverNIF: this.driverNIF,
      taxiPlate: this.selectedTaxiPlate,
      startTime: start,
      endTime: end
    };

    this.turnService.createTurn(newTurn).subscribe({
      next: () => {
        alert('✅ Turn created successfully!');
        this.resetForm();
      },
      error: err => {
        const msg = err.error?.message || 'Error creating turn.';
        if (msg.includes('Driver already has a turn')) {
          alert('⚠️ A turn already exists during this time slot!');
        } else {
          alert('❌ Failed to create turn: ' + msg);
        }
        console.error(err);
      }
    });
  }

  // 🕒 工具方法：将 'HH:mm' 转换为当天的 Date 对象
  getTodayTime(timeStr: string): Date {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const now = new Date();
    const local = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hours,
      minutes
    );
    // 💡 补偿时区偏移，防止 UTC 偏差
    const offset = local.getTimezoneOffset();
    return new Date(local.getTime() - offset * 60000);
  }

  // 🧹 重置表单
  resetForm() {
    this.startTime = '';
    this.endTime = '';
    this.availableTaxis = [];
    this.selectedTaxiPlate = '';
  }
}
