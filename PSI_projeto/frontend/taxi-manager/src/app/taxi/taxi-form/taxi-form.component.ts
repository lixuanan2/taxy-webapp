import { Component } from '@angular/core';
import { Taxi } from '../taxi.model';
import { TaxiService } from '../taxi.service';

@Component({
  selector: 'app-taxi-form',
  templateUrl: './taxi-form.component.html',
  styleUrls: ['./taxi-form.component.css']
})
export class TaxiFormComponent {
  taxi: Taxi = {
    plate: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    comfortLevel: 'basic'
  };

  brands = ['Toyota', 'Ford', 'Mercedes'];
  brandModels: { [key: string]: string[] } = {
    Toyota: ['Corolla', 'Camry', 'Prius'],
    Ford: ['Focus', 'Fiesta', 'Mustang'],
    Mercedes: ['A-Class', 'E-Class', 'S-Class']
  };

  models: string[] = [];
  currentYear = new Date().getFullYear();

  constructor(private taxiService: TaxiService) {}

  ngOnInit(): void {}

  onSubmit() {
    this.taxiService.createTaxi(this.taxi).subscribe({
      next: () => alert('✅ Taxi created successfully!'),
      error: err => {
        const errorMsg = err.error?.error || '';  // MongoDB error 信息
        if (errorMsg.includes('E11000 duplicate key error')) {
          alert('❗ Plate already exists. Please use a different one.');
        } else {
          alert('❌ Failed to create taxi. Please try again.'+ err.message);
        }
      }
    });
  }

  // 自动更新 model 列表
  ngDoCheck(): void {
    this.models = this.brandModels[this.taxi.brand] || [];
  }

  // 添加一个方法，在品牌变更时触发
  onBrandChange(): void {
    this.models = this.brandModels[this.taxi.brand] || [];
    this.taxi.model = '';  // 清空 model
  }
}

