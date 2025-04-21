import { Component, OnInit } from '@angular/core';
import { TaxiService } from '@shared/services/taxi/taxi.service';
import { Taxi } from '@models/taxi.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-taxi-list',
  templateUrl: './taxi-list.component.html',
  styleUrls: ['./taxi-list.component.css']
})
export class TaxiListComponent implements OnInit {

  taxis: Taxi[] = [];

  constructor(
    private taxiService: TaxiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.taxiService.getTaxis().subscribe({
      next: data => this.taxis = data,
      error: err => console.error('Failed to fetch taxis:', err)
    });
  }

  loadTaxis(): void {
    this.taxiService.getTaxis().subscribe({
      next: data => this.taxis = data,
      error: err => console.error('Failed to fetch taxis:', err)
    });
  }

  editTaxi(plate: string) {
    this.router.navigate(['/manager/taxi/edit', plate]);
  }  

  deleteTaxi(plate: string): void {
    if (!confirm('❓ Tem a certeza que deseja remover este táxi?')) return;

    this.taxiService.deleteTaxi(plate).subscribe({
      next: () => {
        alert('✅ Táxi removido com sucesso!');
        this.loadTaxis(); // 重新加载
      },
      error: err => {
        const msg = err.error?.message || 'Erro ao remover táxi.';
        alert(`❌ ${msg}`);
        console.error(err);
      }
    });
  }
}
