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

  // ✅ 获取整体统计（总数 / 总小时 / 总公里）
  getOverallStats(start: string, end: string): Observable<any> {
    const params = new HttpParams().set('start', start).set('end', end);
    return this.http.get<any>(`${this.reportApiUrl}/overview`, { params });
  }

  // ✅ 获取每位司机的小时数 / 公里数
  getDriverStats(start: string, end: string): Observable<any[]> {
    const params = new HttpParams().set('start', start).set('end', end);
    return this.http.get<any[]>(`${this.reportApiUrl}/drivers`, { params });
  }

  // ✅ 获取每辆出租车的小时数 / 公里数
  getTaxiStats(start: string, end: string): Observable<any[]> {
    const params = new HttpParams().set('start', start).set('end', end);
    return this.http.get<any[]>(`${this.reportApiUrl}/taxis`, { params });
  }

  // 🧩 后续详细视图用的 (仍是 trip接口,不变)
  getTripsByDriver(name: string, start: string, end: string): Observable<any[]> {
    const params = new HttpParams().set('driverName', name).set('start', start).set('end', end);
    return this.http.get<any[]>(`${this.reportApiUrl}/driver-details`, { params });
  }

  getTripsByTaxi(plate: string, start: string, end: string): Observable<any[]> {
    const params = new HttpParams().set('vehiclePlate', plate).set('start', start).set('end', end);
    return this.http.get<any[]>(`${this.reportApiUrl}/taxi-details`, { params });
  }

  // ✅ 获取客户统计数据 (Report模块)
  getCustomerStats(start: string, end: string): Observable<any[]> {
    const params = new HttpParams().set('start', start).set('end', end);
    return this.http.get<any[]>(`${this.reportApiUrl}/customers`, { params });
  }

  // ✅ 获取旅程明细列表
  getTripStats(start: string, end: string): Observable<any[]> {
    const params = new HttpParams().set('start', start).set('end', end);
    return this.http.get<any[]>(`${this.reportApiUrl}/trips`, { params });
  }

  // ✅ 获取客户统计总览
  getCustomerOverallStats(start: string, end: string): Observable<any> {
    const params = new HttpParams().set('start', start).set('end', end);
    return this.http.get<any>(`${this.reportApiUrl}/summary`, { params });
  }

  // ✅ 查询单个客户的旅程 (trip模块,不变)
  getTripsByClientNIF(nif: string, start: string, end: string): Observable<any[]> {
    const params = new HttpParams().set('start', start).set('end', end);
    return this.http.get<any[]>(`${this.tripApiUrl}/stats/customer/${nif}`, { params });
  }

  // ✅ 查询所有trip记录 (trip模块,不变)
  getTrips(start?: string, end?: string): Observable<Trip[]> {
    let params = new HttpParams();
    if (start && end) {
      params = params.set('start', start).set('end', end);
    }
    return this.http.get<Trip[]>(`${this.tripApiUrl}`, { params });
  }

}
