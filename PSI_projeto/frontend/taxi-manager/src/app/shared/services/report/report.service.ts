/**
 * 🛠️ ReportService
 *
 * 本服务负责与后端 /api/report 与 /api/trip 接口通讯，
 * 实现统计模块 (Report) 和旅程模块 (Trip) 的数据获取。
 *
 * 对应后端: report.routes.js, trip.routes.js
 * 使用场景: Manager 报表总览、司机统计、出租车统计、客户统计、旅程明细等页面。
 */

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Trip } from '@shared/models/trip.model';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private reportApiUrl = 'http://localhost:3000/api/report';
  private tripApiUrl = 'http://localhost:3000/api/trip';

  constructor(private http: HttpClient) {}

  // 📈 获取整体统计（总旅程数 / 总小时数 / 总公里数）
  getOverallStats(start: string, end: string): Observable<any> {
    const params = new HttpParams().set('start', start).set('end', end);
    return this.http.get<any>(`${this.reportApiUrl}/overview`, { params });
  }

  // 🚗 获取每位司机的小时数与公里数
  getDriverStats(start: string, end: string): Observable<any[]> {
    const params = new HttpParams().set('start', start).set('end', end);
    return this.http.get<any[]>(`${this.reportApiUrl}/drivers`, { params });
  }

  // 🚖 获取每辆出租车的小时数与公里数
  getTaxiStats(start: string, end: string): Observable<any[]> {
    const params = new HttpParams().set('start', start).set('end', end);
    return this.http.get<any[]>(`${this.reportApiUrl}/taxis`, { params });
  }

  // 🧑‍💼 获取客户总支付金额与旅程数
  getCustomerStats(start: string, end: string): Observable<any[]> {
    const params = new HttpParams().set('start', start).set('end', end);
    return this.http.get<any[]>(`${this.reportApiUrl}/customers`, { params });
  }

  // 🛫 获取所有旅程记录 (基于 createdAt)
  getTripStats(start: string, end: string): Observable<any[]> {
    const params = new HttpParams().set('start', start).set('end', end);
    return this.http.get<any[]>(`${this.reportApiUrl}/trips`, { params });
  }

  // 💰 获取客户统计总览（总金额 / 总旅程数 / 客户数）
  getCustomerOverallStats(start: string, end: string): Observable<any> {
    const params = new HttpParams().set('start', start).set('end', end);
    return this.http.get<any>(`${this.reportApiUrl}/summary`, { params });
  }

  // 📋 获取所有旅程记录 (基于 startTime) - 用于司机/出租车
  getTrips(start: string, end: string): Observable<Trip[]> {
    const params = new HttpParams().set('start', start).set('end', end);
    return this.http.get<Trip[]>(`${this.tripApiUrl}`, { params });
  }

  // 📋 获取所有旅程记录 (基于 createdAt) - 用于客户
  getTripsByCreatedAt(start: string, end: string): Observable<Trip[]> {
    const params = new HttpParams().set('start', start).set('end', end);
    return this.http.get<Trip[]>(`${this.reportApiUrl}/trips`, { params });
  }

  // 👤 获取指定司机的所有旅程
  getTripsByDriver(name: string, start: string, end: string): Observable<any[]> {
    const params = new HttpParams().set('driverName', name).set('start', start).set('end', end);
    return this.http.get<any[]>(`${this.reportApiUrl}/driver-details`, { params });
  }

  // 🚕 获取指定出租车的所有旅程
  getTripsByTaxi(plate: string, start: string, end: string): Observable<any[]> {
    const params = new HttpParams().set('vehiclePlate', plate).set('start', start).set('end', end);
    return this.http.get<any[]>(`${this.reportApiUrl}/taxi-details`, { params });
  }

  // 🧑‍💼 获取指定客户的所有旅程 (基于 createdAt)
  getTripsByClientCreatedAt(nif: string, start: string, end: string): Observable<any[]> {
    const params = new HttpParams().set('clientNIF', nif).set('start', start).set('end', end);
    return this.http.get<any[]>(`${this.reportApiUrl}/customer-details`, { params });
  }
}
