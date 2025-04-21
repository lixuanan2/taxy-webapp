import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// 假设后端地址
const API_URL = 'http://localhost:3000';  // 替换为实际的后端地址

@Injectable({
  providedIn: 'root'  // 此服务将在根模块中注入
})
export class ApiService {
  constructor(private http: HttpClient) {}

  // 查询邮政编码对应的城市
  lookupPostalCode(postalCode: string): Observable<{ city: string }> {
    return this.http.get<{ city: string }>(`${API_URL}/getCityByPostalCode/${postalCode}`);
  }
}
