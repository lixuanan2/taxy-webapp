import { HttpClient } from '@angular/common/http';   // Angular内置的HTTP客户端模块
import { Injectable } from '@angular/core';          // 允许服务被注入(DI)
import { Observable } from 'rxjs';                   // 响应式对象,用于异步数据处理
import { Taxi } from './taxi.model';                 // 导入定义好的Taxi接口


@Injectable({
  providedIn: 'root'    // 注册为全局服务,可以在任何组件中注入使用
})
export class TaxiService {

  private apiUrl = 'http://localhost:3000/api/taxis';   // 后端API的基础路径

  constructor(private http: HttpClient) { }       // 依赖注入HttpClient

  getTaxis(): Observable<Taxi[]> {
    return this.http.get<Taxi[]>(this.apiUrl);    // 发送GET请求,返回所有taxi
  }

  createTaxi(taxi: Taxi): Observable<Taxi> {
    return this.http.post<Taxi>(this.apiUrl, taxi);   // 发送POST请求,创建新taxi
  }
}
