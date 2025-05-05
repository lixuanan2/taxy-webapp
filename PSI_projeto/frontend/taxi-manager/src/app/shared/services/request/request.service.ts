/**
 * 🚖 RequestService
 *
 * 本服务负责与后端 /api/request 接口通讯，
 * 实现客户叫车请求 (RideRequest) 的创建、查询、取消、司机接单、客户确认等功能。
 *
 * 对应后端: request.routes.js
 * 使用场景: 客户叫车、司机接单、客户确认司机、请求历史查看。
 */

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

  // 🚖 创建叫车请求
  createRequest(data: RideRequest): Observable<RideRequest> {
    return this.http.post<RideRequest>(this.apiUrl, data);
  }

  // 📡 获取请求状态（用于轮询）
  getRequestStatus(id: string): Observable<RideRequest> {
    return this.http.get<RideRequest>(`${this.apiUrl}/${id}`);
  }

  // ❌ 取消请求
  cancelRequest(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // 📋 获取所有待接单请求 (司机端 Story7)
  getPendingRequests(): Observable<RideRequest[]> {
    return this.http.get<RideRequest[]>(`${this.apiUrl}?status=pending`);
  }

  // ✅ 接受一个请求 (Story7)
  acceptRequest(id: string, driverNIF: string): Observable<RideRequest> {
    return this.http.patch<RideRequest>(`${this.apiUrl}/${id}/accept`, { driverNIF });
  }

  // ❌ 拒绝一个请求 (Story7)
  rejectRequest(id: string): Observable<RideRequest> {
    return this.http.patch<RideRequest>(`${this.apiUrl}/${id}/reject`, {});
  }

  // 📥 获取司机已接受的请求 (Story8)
  getAcceptedRequest(driverName: string): Observable<RideRequest | null> {
    return this.http.get<RideRequest | null>(`${this.apiUrl}/accepted/${driverName}`);
  }

  // 📝 标记请求为完成 (Story8)
  markRequestDone(requestId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${requestId}/done`, {});
  }

  // 🛂 客户确认司机 (Story8)
  confirmRequest(id: string): Observable<RideRequest> {
    return this.http.patch<RideRequest>(`${this.apiUrl}/${id}/confirm`, {});
  }

  // 📚 获取所有请求历史(不按 nif)
  getAllRequests(): Observable<RideRequest[]> {
    return this.http.get<RideRequest[]>('http://localhost:3000/api/request/history');
  }

}
