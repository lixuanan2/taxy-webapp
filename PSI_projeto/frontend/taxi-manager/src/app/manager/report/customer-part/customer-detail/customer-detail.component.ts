import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestService } from '@services/request.service'; // 使用RequestService来获取叫车请求
import { RideRequest } from '@models/ride-request.model'; // 使用RideRequest模型来显示客户数据

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.css']
})
export class CustomerDetailComponent implements OnInit {
  customer: RideRequest | null = null;

  constructor(
    private route: ActivatedRoute,
    private requestService: RequestService, // 使用RequestService来获取请求信息
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.requestService.getRequestStatus(id).subscribe({
        next: (data) => this.customer = data, // 这里的data将包含客户信息
        error: (err) => {
          alert('❌ Erro ao buscar detalhes do cliente');
          this.router.navigate(['/manager/report']);
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/manager/report']); // 导航回报告页面
  }
}
