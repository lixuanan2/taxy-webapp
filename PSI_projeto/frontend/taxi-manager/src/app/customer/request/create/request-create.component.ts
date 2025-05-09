/**
 * 📄 RequestCreateComponent
 *
 * 客户模块的创建请求页面。
 * 功能：填写乘车请求表单，自动定位当前位置，地图选择目的地，提交请求。
 *
 * 模块依赖: Router, RequestService, HttpClient
 */

// 🔗 核心模块导入
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

// 🛠️ 服务与模型导入
import { RequestService } from '@shared/services/request/request.service';
import { RideRequest } from '@models/ride-request.model';

@Component({
  selector: 'app-request-create',
  templateUrl: './request-create.component.html',
  styleUrls: ['./request-create.component.css']
})
export class RequestCreateComponent {

  // 📍 位置信息（当前和目的地）
  currentLat: number = 0;
  currentLon: number = 0;
  destLat: number = 0;
  destLon: number = 0;

  // 🔄 定位状态
  isLocating = true;

  // 📝 乘车请求对象（表单绑定）
  request: RideRequest = {
    nif: '',
    name: '',
    gender: '',
    currentLocation: '',
    destination: '',
    peopleCount: 1,
    comfortLevel: 'basic',
    currentLat: 0,
    currentLon: 0,
    destLat: 0,
    destLon: 0,
  };

  constructor(
    private router: Router,
    private requestService: RequestService,
    private http: HttpClient
  ) {}

  // 🚀 页面初始化时自动定位
  ngOnInit(): void {
    this.autoDetectLocation();
  }

  /**
   * 🌍 自动检测当前地理位置
   */
  autoDetectLocation() {
    this.isLocating = true;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          this.reverseGeocode(lat, lon);
        },
        error => {
          console.warn('📍 Failed to get location:', error.message);
          this.isLocating = false;
        }
      );
    } else {
      console.warn('📍 Geolocation is not supported by this browser.');
    }
  }

  /**
   * 📬 通过坐标反向查询地址 (reverse geocode)
   */
  reverseGeocode(lat: number, lon: number) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;

    this.http.get<any>(url).subscribe({
      next: (data) => {
        const address = data.display_name || `${lat}, ${lon}`;
        this.request.currentLocation = address;
        console.log('📍 Location detected:', address);
      },
      complete: () => this.isLocating = false,
      error: err => {
        console.error('❌ Reverse geocoding failed:', err);
        this.isLocating = false;
      }
    });

    // 保存当前经纬度
    this.currentLat = lat;
    this.currentLon = lon;
    this.request.currentLat = lat;
    this.request.currentLon = lon;
  }

  /**
   * ✉️ 提交乘车请求
   */
  onSubmit() {
    if (this.request.destLat === 0 || this.request.destLon === 0) {
      alert('❌ Please select a destination on the map before submitting.');
      return;
    }

    console.log('🚕 Sending request:', this.request);

    this.requestService.createRequest(this.request).subscribe({
      next: (response) => {
        alert('✅ Request sent successfully!');

        // 保存当前请求 ID(用于等待页面轮询)
        localStorage.setItem('currentRequestId', response._id || '');

        // 跳转至等待响应页面
        this.router.navigate(['/customer/request/waiting']);

        // 重置表单（保持当前位置数据）
        this.request = {
          nif: '',
          name: '',
          gender: '',
          currentLocation: '',
          destination: '',
          peopleCount: 1,
          comfortLevel: 'basic',
          currentLat: this.currentLat,
          currentLon: this.currentLon,
          destLat: this.destLat,
          destLon: this.destLon
        };
      },
      error: (err) => {
        console.error('❌ Failed to send request:', err);
        alert('❌ Failed to send the request. Please try again.');
      }
    });
  }

  /**
   * 📍 地图选点后的回调处理
   */
  onMapClick(event: { lat: number, lon: number }) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${event.lat}&lon=${event.lon}`;

    this.destLat = event.lat;
    this.destLon = event.lon;
    this.request.destLat = event.lat;
    this.request.destLon = event.lon;

    this.http.get<any>(url).subscribe({
      next: (data) => {
        this.request.destination = data.display_name;
      },
      error: (err) => {
        console.error('❌ Reverse geocoding for destination failed:', err);
      }
    });
  }
}
