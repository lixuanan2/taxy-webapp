import { Component, ViewChild } from '@angular/core';
import { Taxi } from '@models/taxi.model';
import { TaxiService } from '@services/taxi.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-taxi-form',
  templateUrl: './taxi-form.component.html',
  styleUrls: ['./taxi-form.component.css']
})

export class TaxiFormComponent {
  @ViewChild('taxiForm') taxiForm!: NgForm;  // 获取表单的引用

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

  // 根据年份选择车牌格式并返回提示信息
  getPlatePattern(year: number): { pattern: string, formatTip: string } {
    if (year >= 2020) {
      return {
        pattern: "^[A-Za-z]{2}-\\d{2}-[A-Za-z]{2}$",  // AA-01-AA
        formatTip: `Plate format for ${year}: AA-01-AA (e.g., AB-12-CD)`
      };
    } else if (year >= 2005) {
      return {
        pattern: "^\\d{2}-[A-Za-z]{2}-\\d{2}$",  // 00-AA-00
        formatTip: `Plate format for ${year}: 00-AA-00 (e.g., 12-AB-34)`
      };
    } else if (year >= 1992) {
      return {
        pattern: "^\\d{2}-\\d{2}-[A-Za-z]{2}$",  // 00-00-AA
        formatTip: `Plate format for ${year}: 00-00-AA (e.g., 12-34-AB)`
      };
    } else {
      return {
        pattern: "^[A-Za-z]{2}-\\d{2}-\\d{2}$",  // AA-00-00
        formatTip: `Plate format for ${year}: AA-00-00 (e.g., AB-12-34)`
      };
    }
  }

  // 车牌格式化：自动添加分隔符
  formatPlate(plate: string): string {
    plate = plate.replace(/[^A-Za-z0-9]/g, '');
    
    // 根据年份选择正确的格式
    const year = this.taxi.year;
    let formattedPlate = '';
    
    if (year >= 2020) {
      // AA-01-AA 格式
      if (plate.length > 2) formattedPlate = plate.substring(0, 2) + '-' + plate.substring(2);
      if (formattedPlate.length > 5) formattedPlate = formattedPlate.substring(0, 5) + '-' + formattedPlate.substring(5);
    } else if (year >= 2005) {
      // 00-AA-00 格式
      if (plate.length > 2) formattedPlate = plate.substring(0, 2) + '-' + plate.substring(2);
      if (formattedPlate.length > 5) formattedPlate = formattedPlate.substring(0, 5) + '-' + formattedPlate.substring(5);
    } else if (year >= 1992) {
      // 00-00-AA 格式
      if (plate.length > 2) formattedPlate = plate.substring(0, 2) + '-' + plate.substring(2);
      if (formattedPlate.length > 5) formattedPlate = formattedPlate.substring(0, 5) + '-' + formattedPlate.substring(5);
    } else {
      // AA-00-00 格式
      if (plate.length > 2) formattedPlate = plate.substring(0, 2) + '-' + plate.substring(2);
      if (formattedPlate.length > 5) formattedPlate = formattedPlate.substring(0, 5) + '-' + formattedPlate.substring(5);
    }
  
    return formattedPlate.toUpperCase();  // 确保字母为大写
  }

  // 处理车牌输入时的格式化
  onPlateInput(event: any): void {
    const rawValue = event.target.value;
    this.taxi.plate = this.formatPlate(rawValue);
  }


  // 提交表单
  onSubmit() {
    this.taxiService.createTaxi(this.taxi).subscribe({
      next: () => {
        alert('✅ Taxi registered successfully!');
        this.taxi = {
          plate: '',
          brand: '',
          model: '',
          year: this.currentYear,
          comfortLevel: 'basic'
        };
      },
      error: err => {
        const msg = err.error?.error || err.message || 'Unknown error';
        if (msg.includes('plate')) {
          alert('🚫 Plate already exists!');
        } else {
          alert('❌ Failed to register taxi: ' + msg);
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

  // 清空表单并恢复为初始值
  onClearForm() {
    this.taxiForm.reset({
      plate: '',
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      comfortLevel: 'basic'
    });
  }

}
