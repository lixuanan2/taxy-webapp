import { Component, OnInit } from '@angular/core';
import { TurnService } from '@services/turn.service';

@Component({
  selector: 'app-create-turn',
  templateUrl: './create-turn.component.html',
  styleUrls: ['./create-turn.component.css']
})
export class CreateTurnComponent implements OnInit {
  driverNif: string = '123456789'; // 🔧 先硬编码，后续从登录获取
  startTime: string = '';
  endTime: string = '';
  availableTaxis: any[] = [];
  selectedTaxiPlate: string = '';

  constructor(private turnService: TurnService) {}

  ngOnInit(): void {
    // 初始化逻辑可以留空，或预加载数据
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
        alert('❌ Failed to create turn');
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
