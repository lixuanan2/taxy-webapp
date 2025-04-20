import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = 'http://localhost:3000/api/trip';

  constructor(private http: HttpClient) {}

  // ✅ 获取整体统计（总数 / 总小时 / 总公里）
  getOverallStats(start: string, end: string): Observable<any> {
    const params = new HttpParams().set('start', start).set('end', end);
    return this.http.get<any>(`${this.apiUrl}/stats`, { params });
  }

  // ✅ 获取每位司机的小时数 / 公里数
  getDriverStats(start: string, end: string): Observable<any[]> {
    const params = new HttpParams().set('start', start).set('end', end);
    return this.http.get<any[]>(`${this.apiUrl}/stats/drivers`, { params });
  }

  // ✅ 获取每辆出租车的小时数 / 公里数
  getTaxiStats(start: string, end: string): Observable<any[]> {
    const params = new HttpParams().set('start', start).set('end', end);
    return this.http.get<any[]>(`${this.apiUrl}/stats/taxis`, { params });
  }

  // 🧩 后续详细视图用的：按司机名或车牌号查 trip（按 startTime 倒序）
  getTripsByDriver(name: string, start: string, end: string): Observable<any[]> {
    const params = new HttpParams()
      .set('driverName', name)
      .set('start', start)
      .set('end', end);
    return this.http.get<any[]>(`${this.apiUrl}/details/driver`, { params });
  }

  getTripsByTaxi(plate: string, start: string, end: string): Observable<any[]> {
    const params = new HttpParams()
      .set('vehiclePlate', plate)
      .set('start', start)
      .set('end', end);
    return this.http.get<any[]>(`${this.apiUrl}/details/taxi`, { params });
  }
}
