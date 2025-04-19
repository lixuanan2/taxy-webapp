import { Component, OnInit } from '@angular/core';
import { TurnService } from '@services/turn.service';
import { DriverAuthService } from '@shared/services/driver-auth.service';

@Component({
  selector: 'app-create-turn',
  templateUrl: './create-turn.component.html',
  styleUrls: ['./create-turn.component.css']
})
export class CreateTurnComponent implements OnInit {
  driverNif: string =  '';

  startTime: string = '';
  endTime: string = '';
  availableTaxis: any[] = [];
  selectedTaxiPlate: string = '';

  constructor(
    private turnService: TurnService,
    private authService: DriverAuthService
  ) {}

  ngOnInit(): void {
    const driver = this.authService.getCurrentDriver();
    if (driver) {
      this.driverNif = driver.nif;
    } else {
      alert('🚫 Erro: motorista não autenticado!');
      // 可以跳转回登录页或禁用功能
    }
  }

  onCheckAvailable() {
    const startDate = this.getTodayTime(this.startTime);
    const endDate = this.getTodayTime(this.endTime);
  
    // 如果 end 小于 start,就加一天表示跨天
    if (endDate <= startDate) {
      endDate.setDate(endDate.getDate() + 1);
    }
  
    const duration = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
    if (duration > 8) {
      alert('⏳ Duration must not exceed 8 hours.');
      return;
    }
  
    this.turnService.getAvailableTaxis(startDate, endDate).subscribe({
      next: (data) => {
        this.availableTaxis = data;
      },
      error: (err) => {
        alert('❌ Failed to fetch available taxis');
        console.error(err);
      }
    });
  }

  onSubmit() {
    if (!this.selectedTaxiPlate) {
      alert('🚕 Please select a taxi!');
      return;
    }
  
    const now = new Date();
    const start = this.getTodayTime(this.startTime);
    const end = this.getTodayTime(this.endTime);
    const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  
    if (start < now) {
      alert('⏰ Start time must be after current time.');
      return;
    }    
  
    if (durationHours > 8) {
      alert('⏳ Turn duration must not exceed 8 hours.');
      return;
    }
  
    const newTurn = {
      driverNif: this.driverNif,
      taxiPlate: this.selectedTaxiPlate,
      startTime: start,
      endTime: end
    };
  
    this.turnService.createTurn(newTurn).subscribe({
      next: () => {
        alert('✅ Turn created successfully!');
        this.resetForm();
      },
      error: err => {
        const msg = err.error?.message || 'Erro ao criar turno';
        if (msg.includes('Driver already has a turn')) {
          alert('⚠️ Já existe um turno nesse horário!');
        } else {
          alert('❌ Falha ao criar turno: ' + msg);
        }
        console.error(err);
      }
    });
  }
  
  getTodayTime(timeStr: string): Date {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const now = new Date();
    return new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hours,
      minutes
    );
  }


  resetForm() {
    this.startTime = '';
    this.endTime = '';
    this.availableTaxis = [];
    this.selectedTaxiPlate = '';
  }
}
