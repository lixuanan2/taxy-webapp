/**
 * 📄 DriverConfirmDialogComponent
 *
 * 本组件属于 Customer 模块，
 * 用于顾客在等待页面 (Waiting) 看到司机接单后的确认弹窗，
 * 展示司机信息、预计到达时间、预计价格、行程信息，
 * 并提供接受 (Accept) 或拒绝 (Reject) 司机的操作按钮。
 *
 * 使用场景: Customer → Waiting 页面
 */

import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-driver-confirm-dialog',
  templateUrl: './driver-confirm-dialog.component.html',
  styleUrls: ['./driver-confirm-dialog.component.css']
})
export class DriverConfirmDialogComponent {

  // 👤 司机姓名
  @Input() driverName: string = '';

  // 📍 司机距离客户的距离 (例如 "2.3 km")
  @Input() distance: string | null = null;

  // 🕒 预计到达时间 (例如 "5 min")
  @Input() eta: string | null = null;

  // 💰 预计车费 (例如 "€7.50")
  @Input() estimatedPrice: string | null = null;

  // 🚖 出租车相关信息 (例如车型、舒适度等)
  @Input() taxiInfo: string | null = null;

  // ✅ 客户接受司机
  @Output() accept = new EventEmitter<void>();

  // ❌ 客户拒绝司机
  @Output() reject = new EventEmitter<void>();
}
