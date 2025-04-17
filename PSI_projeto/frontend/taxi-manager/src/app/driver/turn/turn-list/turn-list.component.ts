import { Component, OnInit } from '@angular/core';
import { TurnService } from '@services/turn.service';

@Component({
  selector: 'app-turn-list',
  templateUrl: './turn-list.component.html',
  styleUrls: ['./turn-list.component.css']
})
export class TurnListComponent implements OnInit {
  turns: any[] = [];
  driverNif: string = '123456789'; // ✅ 临时写死，后续从登录信息获取

  constructor(private turnService: TurnService) {}

  ngOnInit(): void {
    this.turnService.getTurnsByDriver(this.driverNif).subscribe({
      next: data => this.turns = data,
      error: err => {
        console.error('❌ Failed to load turns:', err);
        alert('Failed to fetch turns.');
      }
    });
  }
}
