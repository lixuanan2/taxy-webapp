import { Component } from '@angular/core';
import { Taxi } from '../taxi.model';
import { TaxiService } from '../taxi.service';

@Component({
  selector: 'app-taxi-form',
  templateUrl: './taxi-form.component.html',
  styleUrls: ['./taxi-form.component.css']
})
export class TaxiFormComponent {
  taxi: Taxi = {
    plate: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    comfortLevel: 'basic'
  };

  brands = ['Toyota', 'Ford', 'Mercedes'];
  brandModels: { [key: string]: string[] } = {
    Toyota: ['Corolla', 'Camry', 'Prius'],
    Ford: ['Focus', 'Fiesta', 'Mustang'],
    Mercedes: ['A-Class', 'E-Class', 'S-Class']
  };

  models: string[] = [];
  currentYear = new Date().getFullYear();

  constructor(private taxiService: TaxiService) {}

  ngOnInit(): void {}

  onSubmit() {
    this.taxiService.createTaxi(this.taxi).subscribe({
      next: () => alert('Taxi created successfully!'),
      error: err => alert('Failed to create taxi: ' + err.message)
    });
  }

  // 自动更新 model 列表
  ngDoCheck(): void {
    this.models = this.brandModels[this.taxi.brand] || [];
  }
}

