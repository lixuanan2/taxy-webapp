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

  // 表单测试部分的绑定变量
  testStartTime: string = '';
  testEndTime: string = '';
  testComfort: 'basic' | 'luxury' = 'basic';
  testResult: number | null = null;

  constructor(private priceService: PriceService) {} // ✅ 注入服务

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
    

  calculateTestPrice() {
    if (!this.testStartTime || !this.testEndTime) return;

    const start = new Date(`1970-01-01T${this.testStartTime}:00`);
    const end = new Date(`1970-01-01T${this.testEndTime}:00`);
    const durationMin = (end.getTime() - start.getTime()) / 60000;

    if (durationMin <= 0) {
      this.testResult = null;
      alert('⏰ End time must be after start time.');
      return;
    }

    const baseRate = this.testComfort === 'basic' ? this.price.basic : this.price.luxury;
    const isNight = start.getHours() >= 21 || start.getHours() < 6;
    const rate = isNight ? baseRate * (1 + this.price.nightBonus / 100) : baseRate;

    this.testResult = +(durationMin * rate).toFixed(2);
  }

  getDefaultPrice(): PriceConfig {
    return {
      basic: 0.25,
      luxury: 0.35,
      nightBonus: 20
    };
  }
  
}
