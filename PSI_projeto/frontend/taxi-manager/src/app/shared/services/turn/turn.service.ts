/**
 * 🛠️ TurnService
 *
 * 本服务负责与后端 /api/turns 接口通讯，
 * 实现 Turn(班次)的创建、查询可用出租车、列出司机班次等功能。
 *
 * 对应后端: turn.routes.js
 * 使用场景: Driver 创建 Turn 页面、查看 Turn 列表等。
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// 🚗 模型
import { Turn } from '@shared/models/turn.model';

@Injectable({
  providedIn: 'root'
})
export class TurnService {
  private apiUrl = 'http://localhost:3000/api/turns';

  constructor(private http: HttpClient) {}

  // 获取可用出租车（根据时间段）
  getAvailableTaxis(start: Date, end: Date): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/available?start=${start.toISOString()}&end=${end.toISOString()}`);
  }

  // 提交新 Turn
  createTurn(turn: Turn): Observable<Turn> {
    return this.http.post<Turn>(this.apiUrl, turn);
  }

  // 获取指定司机的所有 Turn（根据 driverNIF）
  getTurnsByDriver(nif: string): Observable<Turn[]> {
    return this.http.get<Turn[]>(`${this.apiUrl}/driver/${nif}`);
  }
}
