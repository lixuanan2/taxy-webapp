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

  // 获取请求状态（用于轮询）
  getRequestStatus(id: string): Observable<RideRequest> {
    return this.http.get<RideRequest>(`${this.apiUrl}/${id}`);
  }

  // 取消请求
  cancelRequest(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // 获取所有待接单请求(司机端 story7)
  getPendingRequests(): Observable<RideRequest[]> {
    return this.http.get<RideRequest[]>(`${this.apiUrl}?status=pending`);
  }

  // 接受一个请求(司机接单 story7)
  acceptRequest(id: string, driverId: string): Observable<RideRequest> {
    return this.http.patch<RideRequest>(`${this.apiUrl}/${id}/accept`, { driverId });
  }  

  // 拒绝一个请求(司机接单 story7)
  rejectRequest(id: string): Observable<RideRequest> {
    return this.http.patch<RideRequest>(`${this.apiUrl}/${id}/reject`, {});
  }
  
}
