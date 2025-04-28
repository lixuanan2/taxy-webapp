/**
 * 📄 TaxiListComponent
 * 
 * 本组件属于 Manager 模块，
 * 用于展示已注册的所有出租车(Taxi),
 * 支持操作：编辑 (Edit)、删除 (Delete)。
 */

import { Component, OnInit } from '@angular/core';
import { TaxiService } from '@shared/services/taxi/taxi.service';
import { Taxi } from '@models/taxi.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-taxi-list',
  templateUrl: './taxi-list.component.html',
  styleUrls: ['./taxi-list.component.css']
})
export class TaxiListComponent implements OnInit {

  // 🚕 出租车列表数据
  taxis: Taxi[] = [];

  constructor(
    private taxiService: TaxiService,
    private router: Router
  ) {}

  // 🔄 页面加载时，拉取出租车数据
  ngOnInit(): void {
    this.taxiService.getTaxis().subscribe({
      next: data => this.taxis = data,
      error: err => console.error('Failed to fetch taxis:', err)
    });
  }

  // 📋 重新加载出租车列表（用于删除后刷新）
  loadTaxis(): void {
    this.taxiService.getTaxis().subscribe({
      next: data => this.taxis = data,
      error: err => console.error('Failed to fetch taxis:', err)
    });
  }

  // ✏️ 点击编辑，跳转到编辑出租车页面
  editTaxi(plate: string): void {
    this.router.navigate(['/manager/taxi/edit', plate]);
  }

  // 🗑️ 删除出租车
  deleteTaxi(plate: string): void {
    if (!confirm('❓ Are you sure you want to delete this taxi?')) return;

    this.taxiService.deleteTaxi(plate).subscribe({
      next: () => {
        alert('✅ Taxi deleted successfully!');
        this.loadTaxis(); // 删除成功后重新加载列表
      },
      error: err => {
        const msg = err.error?.message || 'Error deleting taxi.';
        alert(`❌ ${msg}`);
        console.error(err);
      }
    });
  }
}
