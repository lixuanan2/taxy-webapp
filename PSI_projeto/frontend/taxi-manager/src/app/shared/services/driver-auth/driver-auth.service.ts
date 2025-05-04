/**
 * 🛡️ DriverAuthService
 *
 * 本服务负责管理司机 (Driver) 的登录认证状态，
 * 通过 BehaviorSubject 实现登录、登出、状态持久化功能。
 *
 * 对应后端: 无（本地存储 localStorage）
 * 使用场景: Driver 登录页、Driver 侧边栏展示、需要司机信息的页面鉴权等。
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Driver } from '@models/driver.model';

@Injectable({
  providedIn: 'root'
})
export class DriverAuthService {
  private currentDriverSubject = new BehaviorSubject<Driver | null>(null);
  currentDriver$ = this.currentDriverSubject.asObservable();

  constructor() {
    // 🌟 初始化时从 localStorage 读取身份
    const saved = localStorage.getItem('currentDriver');
    if (saved) {
      try {
        this.currentDriverSubject.next(JSON.parse(saved));
      } catch (e) {
        console.error('❌ Failed to parse saved driver:', e);
        localStorage.removeItem('currentDriver');
      }
    }
  }

  // 登录方法：保存至 BehaviorSubject 和 localStorage
  login(driver: Driver) {
    this.currentDriverSubject.next(driver);
    localStorage.setItem('currentDriver', JSON.stringify(driver));
  }

  // 登出方法：清除身份信息
  logout() {
    this.currentDriverSubject.next(null);
    localStorage.removeItem('currentDriver');
    localStorage.removeItem('currentDriverName'); // 可选：兼容旧方式存的 name
    localStorage.removeItem('currentDriverNif');
  }

  // 获取当前司机（同步调用用）
  getCurrentDriver(): Driver | null {
    return this.currentDriverSubject.value;
  }

  // 是否已登录（辅助工具）
  isLoggedIn(): boolean {
    return !!this.currentDriverSubject.value;
  }
}
