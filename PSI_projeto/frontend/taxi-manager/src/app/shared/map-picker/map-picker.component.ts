/**
 * 🗺️ MapPickerComponent
 *
 * 本组件封装了基于 Leaflet 的地图选点功能。
 * 客户可点击地图选择目的地，自动生成标记并返回经纬度。
 *
 * 使用场景：客户叫车时选择目的地位置。
 *
 * 特点：
 * - 支持显示用户当前位置 (blue icon)
 * - 点击地图任意处可放置目的地标记 (orange icon)
 * - 点击后通过 EventEmitter 向父组件发送 {lat, lon}
 */

import { Component, EventEmitter, Output, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map-picker',
  template: `<div id="map" style="height: 400px;"></div>`,
})
export class MapPickerComponent implements AfterViewInit {
  @Output() locationSelected = new EventEmitter<{ lat: number, lon: number }>();

  ngAfterViewInit(): void {
    const map = L.map('map').setView([38.7169, -9.1399], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    // ✅ 自定义图标：🧍 用户当前位置
    const userIcon = L.icon({
      iconUrl: 'assets/map/icons/user-icon.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32]
    });

    // ✅ 自定义图标：🗺️ 目的地
    const destinationIcon = L.icon({
      iconUrl: 'assets/map/icons/destination-icon.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32]
    });

    // 🔵 显示用户当前位置
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        map.setView([lat, lon], 15);
        L.marker([lat, lon], { icon: userIcon }).addTo(map).bindPopup('📍 Você está aqui').openPopup();
      });
    }

    // 📍 点击地图添加目的地标记
    let marker: L.Marker;
    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;

      if (marker) {
        marker.setLatLng([lat, lng]);
      } else {
        marker = L.marker([lat, lng], { icon: destinationIcon }).addTo(map);
      }

      this.locationSelected.emit({ lat, lon: lng });
    });
  }
}
