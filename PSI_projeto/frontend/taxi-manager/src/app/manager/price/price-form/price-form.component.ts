/**
 * 📄 PriceFormComponent
 * 
 * 本组件属于 Manager 模块，
 * 用于设置出租车服务的 Basic / Luxury 价格，
 * 以及夜间附加费 (Night Bonus),
 * 并提供测试价格的模拟计算功能。
 */

import { Component } from '@angular/core';

// 🚕 模型
import { PriceConfig } from '@models/price.model';

// 🛠️ 服务
import { PriceService } from '@shared/services/price/price.service';

@Component({
  selector: 'app-price-form',
  templateUrl: './price-form.component.html',
  styleUrls: ['./price-form.component.css']
})
export class PriceFormComponent {
  // 💰 当前设置的价格信息
  price: PriceConfig = {
    basic: 0.25,
    luxury: 0.35,
    nightBonus: 20
  };

  // 📋 测试价格用字段
  testStartTime: string = '';
  testEndTime: string = '';
  testComfort: 'basic' | 'luxury' = 'basic';
  testResult: number = 0;

  constructor(private priceService: PriceService) {}

  ngOnInit(): void {
    this.priceService.getLatestPrice().subscribe({
      next: data => this.price = data || this.getDefaultPrice(),
      error: err => console.error('Failed to load latest price:', err)
    });
  }

  // 💾 提交保存价格
  onSubmit(): void {
    const dataToSave = { ...this.price, createdAt: undefined, _id: undefined };
    this.priceService.createPrice(dataToSave).subscribe({
      next: () => alert('✅ Prices saved!'),
      error: err => alert('❌ Failed to save prices: ' + err.message)
    });
  }

  /**
   * 🧮 计算总分钟内多少是夜间，多少是日间
   */
  calculateMinutesWithNightRate(start: Date, end: Date): { day: number, night: number } {
    let nightMinutes = 0;
    let dayMinutes = 0;
    const current = new Date(start);

    while (current < end) {
      const hour = current.getHours();
      const isNight = hour >= 21 || hour < 6;
      if (isNight) {
        nightMinutes++;
      } else {
        dayMinutes++;
      }
      current.setMinutes(current.getMinutes() + 1);
    }

    return { day: dayMinutes, night: nightMinutes };
  }

  /**
   * 🧠 测试计算价格（区分日夜）
   */
  calculateTestPrice(): void {
    if (!this.testStartTime || !this.testEndTime) return;

    const start = new Date(`1970-01-01T${this.testStartTime}:00`);
    let end = new Date(`1970-01-01T${this.testEndTime}:00`);

    // 🌙 跨天处理
    if (end <= start) {
      end.setDate(end.getDate() + 1);
    }

    const { day, night } = this.calculateMinutesWithNightRate(start, end);
    const baseRate = this.testComfort === 'basic' ? this.price.basic : this.price.luxury;
    const total =
      day * baseRate +
      night * baseRate * (1 + this.price.nightBonus / 100);

    this.testResult = +total.toFixed(2);
  }

  // 🔧 默认价格设置
  getDefaultPrice(): PriceConfig {
    return {
      basic: 0.25,
      luxury: 0.35,
      nightBonus: 20
    };
  }
}
