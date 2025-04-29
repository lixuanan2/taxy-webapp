/**
 * 📄 TaxiFormComponent
 * 
 * 本组件属于 Manager 模块，
 * 用于添加新出租车(Taxi)的注册表单，包括:
 * - 填写 Plate、Brand、Model、Year、ComfortLevel
 * - 校验车牌格式
 * - 保存出租车到后端数据库
 */

import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Taxi } from '@models/taxi.model';
import { TaxiService } from '@shared/services/taxi/taxi.service';

@Component({
  selector: 'app-taxi-form',
  templateUrl: './taxi-form.component.html',
  styleUrls: ['./taxi-form.component.css']
})

export class TaxiFormComponent {
  // 🚗 表单引用
  @ViewChild('taxiForm') taxiForm!: NgForm;

  // 🚕 出租车数据对象
  taxi: Taxi = {
    plate: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    comfortLevel: 'basic'
  };

  // 🚘 品牌及其对应型号
  brands = ['Toyota', 'Ford', 'Mercedes'];
  brandModels: { [key: string]: string[] } = {
    Toyota: ['Corolla', 'Camry', 'Prius'],
    Ford: ['Focus', 'Fiesta', 'Mustang'],
    Mercedes: ['A-Class', 'E-Class', 'S-Class']
  };

  // 🚗 当前可选型号列表
  models: string[] = [];
  currentYear = new Date().getFullYear();

  constructor(private taxiService: TaxiService) {}

  ngOnInit(): void {}

  // 📋 根据年份返回车牌格式及提示
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

  // ✏️ 格式化车牌（自动加分隔符）
  formatPlate(plate: string): string {
    plate = plate.replace(/[^A-Za-z0-9]/g, '');

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

    return formattedPlate.toUpperCase();
  }

  // 📋 处理车牌输入变化
  onPlateInput(event: any): void {
    const rawValue = event.target.value;
    this.taxi.plate = this.formatPlate(rawValue);
  }

  // 🚀 提交表单，注册出租车
  onSubmit(): void {
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

  // 📋 实时检测品牌变化，更新型号
  ngDoCheck(): void {
    this.models = this.brandModels[this.taxi.brand] || [];
  }

  // 🛠 品牌改变时清空型号
  onBrandChange(): void {
    this.models = this.brandModels[this.taxi.brand] || [];
    this.taxi.model = '';
  }

  // 🧹 清空表单内容
  onClearForm(): void {
    this.taxiForm.reset({
      plate: '',
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      comfortLevel: 'basic'
    });
  }
}
