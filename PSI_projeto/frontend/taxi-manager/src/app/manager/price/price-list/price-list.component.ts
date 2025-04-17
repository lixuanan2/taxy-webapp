import { Component, OnInit } from '@angular/core';
import { PriceService } from '@services/price.service';
import { PriceConfig } from '@models/price.model';

@Component({
  selector: 'app-price-list',
  templateUrl: './price-list.component.html',
  styleUrls: ['./price-list.component.css']
})
export class PriceListComponent implements OnInit {
  priceList: PriceConfig[] = [];

  constructor(private priceService: PriceService) {}

  ngOnInit(): void {
    this.priceService.getAllPrices().subscribe({
      next: prices => this.priceList = prices,
      error: err => console.error('Failed to load price history:', err)
    });
  }
}
