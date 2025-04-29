/**
 * 🛠️ DriverService
 * 
 * 本服务负责与后端 /api/drivers 接口通讯，
 * 实现司机 (Driver) 的数据获取、创建、更新、删除等功能。
 * 
 * 对应后端: driver.routes.js
 * 使用场景: Driver 注册页面、Driver 列表页面、编辑司机功能等。
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Driver } from '@models/driver.model';

@Injectable({ providedIn: 'root' })
export class DriverService {
  private apiUrl = 'http://localhost:3000/api/drivers';

  constructor(private http: HttpClient) {}

  // 获取所有司机列表
  getDrivers(): Observable<Driver[]> {
    return this.http.get<Driver[]>(this.apiUrl);
  }

  // 创建新司机
  createDriver(driver: Driver): Observable<Driver> {
    return this.http.post<Driver>(this.apiUrl, driver);
  }

  // 根据 NIF 删除司机
  deleteDriver(nif: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${nif}`);
  }

  // 根据 NIF 查询单个司机
  getDriverByNif(nif: string): Observable<Driver> {
    return this.http.get<Driver>(`${this.apiUrl}/${nif}`);
  }

  // 更新司机信息
  updateDriver(nif: string, data: Driver): Observable<any> {
    return this.http.put(`${this.apiUrl}/${nif}`, data);
  }
}
