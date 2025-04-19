import { Component } from '@angular/core';
import { PriceConfig } from '@models/price.model';
import { PriceService } from '@services/price.service';

@Component({
  selector: 'app-price-form',
  templateUrl: './price-form.component.html',
  styleUrls: ['./price-form.component.css']
})
export class PriceFormComponent {
  price: PriceConfig = {
    basic: 0.25,
    luxury: 0.35,
    nightBonus: 20, // 20%
  };

  testStartTime: string = '';
  testEndTime: string = '';
  testComfort: 'basic' | 'luxury' = 'basic';
  testResult: number | null = null;

  constructor(private priceService: PriceService) {}

  ngOnInit(): void {
    this.priceService.getLatestPrice().subscribe({
      next: data => this.price = data || this.getDefaultPrice(),
      error: err => console.error('Failed to load latest price:', err)
    });
  }

  onSubmit() {
    const dataToSave = { ...this.price, createdAt: undefined, _id: undefined };
    this.priceService.createPrice(dataToSave).subscribe({
      next: () => alert('✅ Prices saved!'),
      error: err => alert('❌ Failed to save prices: ' + err.message)
    });
  }

  /**
   * 按分钟计算属于夜间/日间的分钟数
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
   * 更精细的价格模拟计算（区分日夜）
   */
  calculateTestPrice() {
    if (!this.testStartTime || !this.testEndTime) return;

    const start = new Date(`1970-01-01T${this.testStartTime}:00`);
    let end = new Date(`1970-01-01T${this.testEndTime}:00`);

    // 跨天处理
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

  getDefaultPrice(): PriceConfig {
    return {
      basic: 0.25,
      luxury: 0.35,
      nightBonus: 20
    };
  }
}
