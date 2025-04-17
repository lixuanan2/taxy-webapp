import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TurnService {
  private apiUrl = 'http://localhost:3000/api/turns';

  constructor(private http: HttpClient) {}

  // 获取可用 taxi（根据时间段）
  getAvailableTaxis(start: Date, end: Date): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/available?start=${start.toISOString()}&end=${end.toISOString()}`);
  }

  // 提交 turno 请求
  createTurn(turn: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, turn);
  }

  // 获取当前司机已有 turno（后续 list 页面用）
  getTurnsByDriver(nif: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/driver/${nif}`);
  }
}
