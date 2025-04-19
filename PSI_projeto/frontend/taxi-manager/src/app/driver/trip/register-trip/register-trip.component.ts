import { Component, OnInit } from '@angular/core';
import { TripService } from '@services/trip.service';
import { Trip } from '@models/trip.model';
import { TurnService } from '@services/turn.service';
import { RequestService } from '@shared/services/request.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-trip',
  templateUrl: './register-trip.component.html',
  styleUrls: ['./register-trip.component.css']
})
export class RegisterTripComponent implements OnInit {
  trip: Trip = {
    driverName: localStorage.getItem('currentDriverName') || '',
    driverNIF: localStorage.getItem('currentDriverNIF') || '',
    clientNIF: '',
    from: '',
    to: '',
    startTime: new Date(),
    endTime: new Date(),
    price: 0,
    vehiclePlate: '',
    peopleCount: 1,
    sequenceNumber: 1
  };

  constructor(
    private tripService: TripService,
    private turnService: TurnService,
    private requestService: RequestService,
    private router: Router
  ) {}

  onSubmit(): void {
    const driverName = this.trip.driverName;
    const driverNIF = localStorage.getItem('currentDriverNIF') || '';
    const newStart = new Date(this.trip.startTime);
    const newEnd = new Date(this.trip.endTime);

    console.log('🚗 driverNIF:', driverNIF);

    this.tripService.getTripsByDriver(driverName).subscribe({
      next: (existingTrips) => {
        const conflict = existingTrips.some(t => {
          const s = new Date(t.startTime);
          const e = new Date(t.endTime);
          return s < newEnd && e > newStart;
        });

        if (conflict) {
          alert('❌ Já existe uma viagem neste horário.');
          return;
        }

        // 第二步：验证是否在 turno 时间段内
        this.turnService.getTurnsByDriver(driverNIF).subscribe({
          next: (turnos) => {
            console.log('📋 turnos recebidos:', turnos);
            const inTurno = turnos.some(t => {
              const s = new Date(t.startTime).getTime();
              const e = new Date(t.endTime).getTime();
              return newStart.getTime() >= s && newEnd.getTime() <= e;
            });

            if (!inTurno) {
              alert('❌ A viagem está fora do horário de turno do motorista.');
              return;
            }

            this.tripService.createTrip(this.trip).subscribe({
              next: () => {
                alert('✅ Viagem registada com sucesso!');
                
                // ✅ 标记 request 为 done（保持原有逻辑）
                const latestRequest = localStorage.getItem('latestRequest');
                if (latestRequest) {
                  const req = JSON.parse(latestRequest);
                  this.requestService.markRequestDone(req._id).subscribe({
                    next: () => console.log('🚫 Pedido marcado como concluído.'),
                    error: err => console.warn('⚠️ Falha ao marcar pedido como concluído:', err)
                  });
                }
            
                // ✅ 清除缓存
                localStorage.removeItem('latestRequest');
            
                // ✅ 跳转回 dashboard
                this.router.navigate(['/driver/dashboard']);
            
                this.resetForm();
              },
              error: err => {
                alert('❌ Erro ao registar a viagem.');
                console.error(err);
              }
            });
          },
          error: err => {
            alert('❌ Erro ao verificar turnos.');
            console.error(err);
          }
        });
      },
      error: err => {
        alert('❌ Erro ao verificar viagens anteriores.');
        console.error(err);
      }
    });
  }

  resetForm(): void {
    this.trip = {
      driverName: localStorage.getItem('currentDriverName') || '',
      driverNIF: localStorage.getItem('currentDriverNIF') || '',
      clientNIF: '',
      from: '',
      to: '',
      startTime: new Date(),
      endTime: new Date(),
      price: 0,
      vehiclePlate: '',
      peopleCount: 1,
      sequenceNumber: 1
    };
  }

  ngOnInit(): void {
    const latestRequest = localStorage.getItem('latestRequest');
    if (latestRequest) {
      const request = JSON.parse(latestRequest);
      this.trip.clientNIF = request.nif;
      this.trip.from = request.currentLocation;
      this.trip.to = request.destination;
      this.trip.peopleCount = request.peopleCount || 1;
    }
  }

  get formattedStartTime(): string {
    return this.formatDate(this.trip.startTime);
  }
  
  set formattedStartTime(value: string) {
    this.trip.startTime = new Date(value);
  }
  
  get formattedEndTime(): string {
    return this.formatDate(this.trip.endTime);
  }
  
  set formattedEndTime(value: string) {
    this.trip.endTime = new Date(value);
  }
  
  private formatDate(date: Date): string {
    return date.toISOString().slice(0, 16); // 截取 "yyyy-MM-ddTHH:mm"
  }
  
}
