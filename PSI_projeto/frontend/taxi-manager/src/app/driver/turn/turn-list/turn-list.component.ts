import { Component, OnInit } from '@angular/core';
import { TurnService } from '@services/turn.service';
import { DriverAuthService } from '@shared/services/driver-auth.service';

@Component({
  selector: 'app-turn-list',
  templateUrl: './turn-list.component.html',
  styleUrls: ['./turn-list.component.css']
})
export class TurnListComponent implements OnInit {
  turns: any[] = [];
  driverNif: string = '123456789'; // ✅ 临时写死，后续从登录信息获取

  constructor(
    private turnService: TurnService,
    private authService: DriverAuthService
  ) {}

  ngOnInit(): void {
    const driver = this.authService.getCurrentDriver();
    if (!driver) {
      alert('⚠️ Motorista não autenticado.');
      return;
    }
  
    this.driverNif = driver.nif;
    this.turnService.getTurnsByDriver(this.driverNif).subscribe({
      next: data => this.turns = data,
      error: err => {
        console.error('❌ Failed to load turns:', err);
        alert('Failed to fetch turns.');
      }
    });
  }
  
}
