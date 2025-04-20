import { Component, OnInit } from '@angular/core';
import { Driver } from '@models/driver.model';
import { DriverService } from '@services/driver.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-driver-list',
  templateUrl: './driver-list.component.html',
  styleUrls: ['./driver-list.component.css']
})
export class DriverListComponent implements OnInit {
  drivers: Driver[] = [];

  constructor(
    private driverService: DriverService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.driverService.getDrivers().subscribe({
      next: (data) => this.drivers = data,
      error: (err) => console.error('Error fetching drivers:', err)
    });
  }

  onEdit(driver: Driver): void {
    // 你可以跳转页面，也可以用弹窗方式
    // 假设跳转方式：
    this.router.navigate(['/manager/driver-form', driver.nif]);
  }
  
  onDelete(driver: Driver): void {
    if (confirm(`❗ Confirmar remoção do motorista ${driver.name}?`)) {
      this.driverService.deleteDriver(driver.nif).subscribe({
        next: () => {
          alert('✅ Motorista removido com sucesso.');
          this.refresh(); // 重新加载列表
        },
        error: (err) => {
          alert('🚫 ' + (err.error?.message || 'Erro ao remover motorista.'));
        }
      });
    }
  }
  
  refresh(): void {
    this.driverService.getDrivers().subscribe({
      next: (data) => this.drivers = data,
      error: (err) => console.error('Erro ao atualizar lista:', err)
    });
  }
  
}
