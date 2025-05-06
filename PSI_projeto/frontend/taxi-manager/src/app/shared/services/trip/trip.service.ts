/**
 * 🚖 TripService
 *
 * 本服务负责与后端 /api/trip 接口通讯，
 * 实现旅程 (Trip) 的创建、查询、统计分析等功能。
 *
 * 对应后端: trip.routes.js
 * 使用场景: 客户行程登记、司机行程管理、数据统计与报表生成。
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Trip } from '@models/trip.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  private apiUrl = 'http://localhost:3000/api/trip';

  constructor(private http: HttpClient) {}

  // =============================
  // 🛫 创建旅程
  // =============================
  createTrip(trip: Trip): Observable<Trip> {
    return this.http.post<Trip>(this.apiUrl, trip);
  }

  // =============================
  // 📋 获取旅程记录
  // =============================
  getAllTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(this.apiUrl);
  }

  getTripsByDriver(driverName: string): Observable<Trip[]> {
    return this.http.get<Trip[]>(`${this.apiUrl}?driverName=${driverName}`);
  }

  getTripsByVehiclePlate(vehiclePlate: string): Observable<Trip[]> {
    return this.http.get<Trip[]>(`${this.apiUrl}?vehiclePlate=${vehiclePlate}`);
  }

  getTripById(id: string): Observable<Trip> {
    return this.http.get<Trip>(`${this.apiUrl}/${id}`);
  }

  // =============================
  // 📊 获取统计信息
  // =============================

  // 总体统计（总数/小时数/公里数）
  getTripStats(start?: Date, end?: Date): Observable<any> {
    const params = this.buildQuery({ start, end });
    return this.http.get<any>(`${this.apiUrl}/stats?${params}`);
  }

  // 司机统计
  getDriverStats(start?: Date, end?: Date): Observable<any[]> {
    const params = this.buildQuery({ start, end });
    return this.http.get<any[]>(`${this.apiUrl}/stats/drivers?${params}`);
  }

  // 出租车统计
  getTaxiStats(start?: Date, end?: Date): Observable<any[]> {
    const params = this.buildQuery({ start, end });
    return this.http.get<any[]>(`${this.apiUrl}/stats/taxis?${params}`);
  }

  // 客户支付统计
  getCustomerStats(start?: Date, end?: Date): Observable<any[]> {
    const params = this.buildQuery({ start, end });
    return this.http.get<any[]>(`${this.apiUrl}/stats/customers?${params}`);
  }

  // 总体财务汇总
  getOverallSummary(start?: Date, end?: Date): Observable<any> {
    const params = this.buildQuery({ start, end });
    return this.http.get<any>(`${this.apiUrl}/stats/summary?${params}`);
  }

  // =============================
  // 📄 细节查询
  // =============================

  getTripsOfDriver(driverName: string, start?: Date, end?: Date): Observable<Trip[]> {
    const params = this.buildQuery({ driverName, start, end });
    return this.http.get<Trip[]>(`${this.apiUrl}/details/driver?${params}`);
  }

  getTripsOfTaxi(vehiclePlate: string, start?: Date, end?: Date): Observable<Trip[]> {
    const params = this.buildQuery({ vehiclePlate, start, end });
    return this.http.get<Trip[]>(`${this.apiUrl}/details/taxi?${params}`);
  }

  getTripsOfCustomer(clientNIF: string, start?: Date, end?: Date): Observable<Trip[]> {
    const params = this.buildQuery({ start, end });
    return this.http.get<Trip[]>(`${this.apiUrl}/stats/customer/${clientNIF}?${params}`);
  }

  // =============================
  // 🔧 辅助方法
  // =============================

  private buildQuery(params: any): string {
    const query = new URLSearchParams();
    if (params.start) query.set('start', new Date(params.start).toISOString());
    if (params.end) query.set('end', new Date(params.end).toISOString());
    if (params.driverName) query.set('driverName', params.driverName);
    if (params.vehiclePlate) query.set('vehiclePlate', params.vehiclePlate);
    return query.toString();
  }
}
