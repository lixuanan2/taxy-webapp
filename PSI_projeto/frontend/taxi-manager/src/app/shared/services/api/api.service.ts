/**
 * 🛠️ ApiService
 * 
 * 本服务提供通用 API 调用功能，
 * 当前主要用于根据邮政编码 (Postal Code) 查询对应城市信息。
 * 
 * 对应后端: getCityByPostalCode 路由。
 * 使用场景: 司机注册页面 (DriverForm) 填写地址信息时辅助填写城市。
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// 后端 API 地址
const API_URL = 'http://localhost:3000';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  // 根据邮政编码查询城市信息
  lookupPostalCode(postalCode: string): Observable<{ city: string }> {
    return this.http.get<{ city: string }>(`${API_URL}/getCityByPostalCode/${postalCode}`);
  }
}
