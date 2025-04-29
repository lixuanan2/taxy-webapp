/**
 * 📄 PriceListComponent
 * 
 * 本组件属于 Manager 模块，
 * 用于展示保存过的出租车服务价格（Price）历史记录，
 * 包括 Basic、Luxury、Night Bonus 以及创建时间。
 */

import { Component, OnInit } from '@angular/core';

// 📦 模型与服务
import { PriceConfig } from '@models/price.model';
import { PriceService } from '@shared/services/price/price.service';

@Component({
  selector: 'app-price-list',
  templateUrl: './price-list.component.html',
  styleUrls: ['./price-list.component.css']
})
export class PriceListComponent implements OnInit {

  // 📜 历史价格记录列表
  priceList: PriceConfig[] = [];

  constructor(private priceService: PriceService) {}

  // 🔄 页面加载时拉取全部价格记录
  ngOnInit(): void {
    this.priceService.getAllPrices().subscribe({
      next: (prices) => this.priceList = prices,
      error: (err) => console.error('Failed to load price history:', err)
    });
  }
}
