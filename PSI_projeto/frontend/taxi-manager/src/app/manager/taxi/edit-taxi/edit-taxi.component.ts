/**
 * ✏️ EditTaxiComponent
 *
 * 本组件属于 Manager 模块，
 * 用于编辑已有出租车 (Taxi) 的信息，包括：
 * - 修改品牌 (Brand)、型号 (Model)、年份 (Year)、舒适度等级 (Comfort Level)
 * - 校验年份不能超过当前年份
 * - 保存更新到后端数据库
 */

import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaxiService } from '@shared/services/taxi/taxi.service';
import { Taxi } from '@shared/models/taxi.model';

@Component({
  selector: 'app-edit-taxi',
  templateUrl: './edit-taxi.component.html',
  styleUrls: ['./edit-taxi.component.css']
})
export class EditTaxiComponent {
  // 🚕 当前正在编辑的出租车对象
  taxi: Taxi = {
    plate: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    comfortLevel: 'basic',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // 📅 当前年份（用于年份校验）
  currentYear = new Date().getFullYear();

  constructor(
    private route: ActivatedRoute,
    private taxiService: TaxiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const plate = this.route.snapshot.paramMap.get('plate')!;
    this.taxiService.getTaxiByPlate(plate).subscribe({
      next: data => this.taxi = data,
      error: err => {
        alert('❌ Failed to load taxi data.');
        console.error(err);
      }
    });
  }

  /**
   * 💾 提交更新出租车信息
   */
  onSubmit(): void {
    this.taxi.updatedAt = new Date(); // 自动更新时间戳

    this.taxiService.updateTaxi(this.taxi).subscribe({
      next: () => {
        alert('✅ Taxi updated successfully!');
        this.router.navigate(['/manager/taxi/taxi-list']);
      },
      error: err => {
        const msg = err.error?.message || '❌ Failed to update taxi.';
        alert(msg);
        console.error(err);
      }
    });
  }
}
