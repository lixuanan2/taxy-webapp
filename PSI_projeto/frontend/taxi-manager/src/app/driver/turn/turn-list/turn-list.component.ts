/**
 * 📄 TurnListComponent
 *
 * 本组件属于 Driver 模块，
 * 用于展示当前登录司机的所有 Turn(班次)记录，
 * 数据来源于后端 /api/turns/driver/:nif 接口。
 */

import { Component, OnInit } from '@angular/core';

// 🛠️ 服务
import { TurnService } from '@shared/services/turn/turn.service';
import { DriverAuthService } from '@shared/services/driver-auth/driver-auth.service';

@Component({
  selector: 'app-turn-list',
  templateUrl: './turn-list.component.html',
  styleUrls: ['./turn-list.component.css']
})
export class TurnListComponent implements OnInit {
  // 📋 当前司机的全部 Turn 记录
  turns: any[] = [];

  // 🆔 当前司机的 NIF(从登录信息提取)
  driverNif: string = '';

  constructor(
    private turnService: TurnService,
    private authService: DriverAuthService
  ) {}

  ngOnInit(): void {
    // 🚀 获取当前登录司机
    const driver = this.authService.getCurrentDriver();
    if (!driver) {
      alert('⚠️ Driver not authenticated.');
      return;
    }

    this.driverNif = driver.nif;

    // 🌟 查询后端，加载 turn 列表
    this.turnService.getTurnsByDriver(this.driverNif).subscribe({
      next: (data) => {
        this.turns = data;
      },
      error: (err) => {
        console.error('❌ Failed to load turns:', err);
        alert('Failed to fetch turns.');
      }
    });
  }
}
