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

    // ✅ 自定义图标（🧍当前位置图标）
    const userIcon = L.icon({
      iconUrl: 'assets/map/icons/user-icon.png',  // user图标
      iconSize: [32, 32],
      iconAnchor: [16, 32]
    });

    // ✅ 自定义图标（🗺️目的地图标）
    const destinationIcon = L.icon({
      iconUrl: 'assets/map/icons/destination-icon.png',  // destiination图标
      iconSize: [32, 32],
      iconAnchor: [16, 32]
    });

    // 🔵 显示当前位置
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        map.setView([lat, lon], 15);
        L.marker([lat, lon], { icon: userIcon }).addTo(map).bindPopup('📍 Você está aqui').openPopup();
      });
    }

    // 📍 用户点击地图时放置🗺️图标
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
