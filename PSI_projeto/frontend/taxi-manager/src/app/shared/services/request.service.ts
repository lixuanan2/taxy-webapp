import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RideRequest } from '@shared/models/ride-request.model';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  private apiUrl = 'http://localhost:3000/api/request';  // 后端请求地址

  constructor(private http: HttpClient) {}

  // 创建叫车请求
  createRequest(data: RideRequest): Observable<RideRequest> {
    return this.http.post<RideRequest>(this.apiUrl, data);
  }

  // ✅ NEW: GET 请求状态
  getRequestStatus(id: string): Observable<RideRequest> {
    return this.http.get<RideRequest>(`${this.apiUrl}/${id}`);
  }

  // 取消请求（可选）
  cancelRequest(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  
}
