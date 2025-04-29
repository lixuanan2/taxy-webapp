/**
 * 🛠️ PriceService
 * 
 * 本服务负责与后端 /api/prices 接口通讯，
 * 实现价格配置 (PriceConfig) 的获取、保存与历史记录查询功能。
 * 
 * 对应后端: price.routes.js
 * 使用场景: Price 设置页面、Price 历史列表页面。
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PriceConfig } from '@models/price.model';

@Injectable({ providedIn: 'root' })
export class PriceService {
  private apiUrl = 'http://localhost:3000/api/prices';

  constructor(private http: HttpClient) {}

  // 获取最新价格配置
  getLatestPrice(): Observable<PriceConfig> {
    return this.http.get<PriceConfig>(`${this.apiUrl}/latest`);
  }

  // 创建新价格配置
  createPrice(price: PriceConfig): Observable<PriceConfig> {
    return this.http.post<PriceConfig>(this.apiUrl, price);
  }

  // 获取所有历史价格配置
  getAllPrices(): Observable<PriceConfig[]> {
    return this.http.get<PriceConfig[]>(`${this.apiUrl}/all`);
  }
}
