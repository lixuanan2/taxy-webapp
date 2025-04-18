import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RequestService } from '@services/request.service';
import { RideRequest } from '@models/ride-request.model';

@Component({
  selector: 'app-request-create',
  templateUrl: './request-create.component.html',
  styleUrls: ['./request-create.component.css']
})
export class RequestCreateComponent {

  constructor(
    private router: Router,
    private requestService: RequestService
  ) {}

  request: RideRequest = {
    nif: '',
    gender: '', 
    currentLocation: '',
    destination: '',
    peopleCount: 1
  };

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
}
