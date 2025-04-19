import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RequestService } from '@services/request.service';
import { RideRequest } from '@models/ride-request.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-request-create',
  templateUrl: './request-create.component.html',
  styleUrls: ['./request-create.component.css']
})
export class RequestCreateComponent {

  constructor(
    private router: Router,
    private requestService: RequestService,
    private http: HttpClient
  ) {}

  isLocating = true;

  request: RideRequest = {
    nif: '',
    gender: '', 
    currentLocation: '',
    destination: '',
    peopleCount: 1
  };

  ngOnInit(): void {
    this.autoDetectLocation(); // 页面加载自动尝试定位
  }

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
          console.warn('📍 Falha ao obter localização:', error.message);
          this.isLocating = false;
        }
      );
    } else {
      console.warn('📍 Geolocation não é suportado neste navegador.');
    }
  }

  reverseGeocode(lat: number, lon: number) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
    
    this.http.get<any>(url).subscribe({
      next: (data) => {
        const address = data.display_name || `${lat}, ${lon}`;
        this.request.currentLocation = address;
        console.log('📍 Localização detectada:', address);
      },
      complete: () => this.isLocating = false,
      error: err => {
        console.error('❌ Erro no reverse geocode:', err);
      }
    });
  }

  onSubmit() {
    console.log('🚕 Enviando pedido:', this.request);

    this.requestService.createRequest(this.request).subscribe({
      next: (response) => {
        alert('✅ Pedido enviado com sucesso!');
        
        // 保存 ID 到 localStorage，用于后续 waiting 页轮询
        localStorage.setItem('currentRequestId', response._id || '');

        // 跳转到等待页面
        this.router.navigate(['/customer/request/waiting']);

        // 清空表单
        this.request = {
          nif: '',
          gender: '',
          currentLocation: '',
          destination: '',
          peopleCount: 1
        };
      },
      error: (err) => {
        console.error('Erro ao enviar pedido:', err);
        alert('❌ Falha ao enviar o pedido. Tente novamente.');
      }
    });
  }

  onMapClick(event: any) { // ✅ 或直接写 { lat, lon }
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${event.lat}&lon=${event.lon}`;
    this.http.get<any>(url).subscribe(data => {
      this.request.destination = data.display_name;
    });
  }
}
