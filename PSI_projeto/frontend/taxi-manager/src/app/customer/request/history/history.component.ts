import { Component, OnInit } from '@angular/core';
import { RequestService } from '@shared/services/request/request.service';
import { RideRequest } from '@shared/models/ride-request.model';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  requests: RideRequest[] = [];

  constructor(private requestService: RequestService) {}

  ngOnInit(): void {
    this.requestService.getAllRequests().subscribe({
      next: (data) => {
        // 💡 如果后端返回的 status 包含 "done"，我们手动映射为 "accepted"
        this.requests = data.map(req => ({
          ...req,
          status: req.status === 'done' ? 'accepted' : req.status
        }));
      },
      error: (err) => console.error('❌ Erro ao buscar histórico:', err)
    });
  }
}
