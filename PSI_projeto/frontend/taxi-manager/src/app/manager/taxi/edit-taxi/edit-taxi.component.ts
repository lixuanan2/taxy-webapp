import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaxiService } from '@shared/services/taxi.service';
import { Taxi } from '@shared/models/taxi.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-taxi',
  templateUrl: './edit-taxi.component.html',
  styleUrls: ['./edit-taxi.component.css']
})
export class EditTaxiComponent {
  taxi: Taxi = {
    plate: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    comfortLevel: 'basic',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  constructor(
    private route: ActivatedRoute,
    private taxiService: TaxiService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    const plate = this.route.snapshot.paramMap.get('plate')!;
    this.taxiService.getTaxiByPlate(plate).subscribe({
      next: data => this.taxi = data,
      error: err => {
        alert('❌ Falha ao carregar dados do táxi.');
        console.error(err);
      }
    });
  }

  onSubmit(): void {
    this.taxi.updatedAt = new Date(); // 🔄 更新时间
  
    this.taxiService.updateTaxi(this.taxi).subscribe({
      next: () => {
        alert('✅ Táxi atualizado com sucesso!');
        this.router.navigate(['/manager/taxi/taxi-list']);
      },
      error: err => {
        const msg = err.error?.message || '❌ Falha ao atualizar o táxi.';
        alert(msg); // ⬅️ 显示更清楚的后端返回消息
        console.error(err);
      }
    });
  }
  
}
