/**
 * 🛠️ TaxiService
 * 
 * 本服务负责与后端 /api/taxis 接口通讯，
 * 实现出租车 (Taxi) 的数据获取、创建、更新、删除等功能。
 * 
 * 对应后端: taxi.routes.js
 * 使用场景: Taxi 注册页面、Taxi 列表页面、编辑出租车功能等。
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Taxi } from '@models/taxi.model';

@Injectable({
  providedIn: 'root'
})
export class TaxiService {

  private apiUrl = 'http://localhost:3000/api/taxis';

  constructor(private http: HttpClient) {}

  // 获取所有出租车列表
  getTaxis(): Observable<Taxi[]> {
    return this.http.get<Taxi[]>(this.apiUrl);
  }

  // 创建新出租车
  createTaxi(taxi: Taxi): Observable<Taxi> {
    return this.http.post<Taxi>(this.apiUrl, taxi);
  }

  // 根据车牌删除出租车
  deleteTaxi(plate: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${plate}`);
  }

  // 根据车牌查询单个出租车
  getTaxiByPlate(plate: string): Observable<Taxi> {
    return this.http.get<Taxi>(`${this.apiUrl}/${plate}`);
  }

  // 更新出租车信息
  updateTaxi(taxi: Taxi): Observable<Taxi> {
    return this.http.put<Taxi>(`${this.apiUrl}/${taxi.plate}`, taxi);
  }
}
