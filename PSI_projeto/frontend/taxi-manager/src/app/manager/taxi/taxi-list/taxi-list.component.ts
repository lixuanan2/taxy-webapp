import { Component, OnInit } from '@angular/core';
import { TaxiService } from '@services/taxi.service';
import { Taxi } from '@models/taxi.model';

@Component({
  selector: 'app-taxi-list',
  templateUrl: './taxi-list.component.html',
  styleUrls: ['./taxi-list.component.css']
})
export class TaxiListComponent implements OnInit {

  taxis: Taxi[] = [];

  constructor(private taxiService: TaxiService) {}

  ngOnInit(): void {
    this.taxiService.getTaxis().subscribe({
      next: data => this.taxis = data,
      error: err => console.error('Failed to fetch taxis:', err)
    });
  }
}
