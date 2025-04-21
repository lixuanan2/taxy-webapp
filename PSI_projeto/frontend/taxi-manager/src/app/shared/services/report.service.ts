import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private tripApiUrl = 'http://localhost:3000/api/trip';
  private requestApiUrl = 'http://localhost:3000/api/request';


  constructor(private http: HttpClient) {}

  // ✅ 获取整体统计（总数 / 总小时 / 总公里）
  getOverallStats(start: string, end: string): Observable<any> {
    const params = new HttpParams().set('start', start).set('end', end);
    return this.http.get<any>(`${this.tripApiUrl}/stats`, { params });
  }

  // ✅ 获取每位司机的小时数 / 公里数
  getDriverStats(start: string, end: string): Observable<any[]> {
    const params = new HttpParams().set('start', start).set('end', end);
    return this.http.get<any[]>(`${this.tripApiUrl}/stats/drivers`, { params });
  }

  // ✅ 获取每辆出租车的小时数 / 公里数
  getTaxiStats(start: string, end: string): Observable<any[]> {
    const params = new HttpParams().set('start', start).set('end', end);
    return this.http.get<any[]>(`${this.tripApiUrl}/stats/taxis`, { params });
  }

  // 🧩 后续详细视图用的：按司机名或车牌号查 trip（按 startTime 倒序）
  getTripsByDriver(name: string, start: string, end: string): Observable<any[]> {
    const params = new HttpParams()
      .set('driverName', name)
      .set('start', start)
      .set('end', end);
    return this.http.get<any[]>(`${this.tripApiUrl}/details/driver`, { params });
  }

  getTripsByTaxi(plate: string, start: string, end: string): Observable<any[]> {
    const params = new HttpParams()
      .set('vehiclePlate', plate)
      .set('start', start)
      .set('end', end);
    return this.http.get<any[]>(`${this.tripApiUrl}/details/taxi`, { params });
  }

  // ✅ 获取客户统计数据（来自 request 模块）
  getCustomerStats(start: string, end: string): Observable<any[]> {
    const params = new HttpParams().set('start', start).set('end', end);
    return this.http.get<any[]>(`${this.requestApiUrl}/stats/customers`, { params });
  }

  // ✅ 获取旅程统计数据（来自 request 模块）
  getTripStats(start: string, end: string): Observable<any[]> {
    const params = new HttpParams().set('start', start).set('end', end);
    return this.http.get<any[]>(`${this.requestApiUrl}/stats/trips`, { params });
  }

  getCustomerOverallStats(start: string, end: string): Observable<any> {
    const params = new HttpParams().set('start', start).set('end', end);
    return this.http.get<any>(`http://localhost:3000/api/request/stats`, { params });
  }
  
  
}
