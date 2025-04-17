// src/app/shared/services/price.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PriceConfig } from '@models/price.model';

@Injectable({ providedIn: 'root' })
export class PriceService {
  private apiUrl = 'http://localhost:3000/api/prices';

  constructor(private http: HttpClient) {}

  getLatestPrice(): Observable<PriceConfig> {
    return this.http.get<PriceConfig>(`${this.apiUrl}/latest`);
  }

  createPrice(data: PriceConfig): Observable<PriceConfig> {
    return this.http.post<PriceConfig>(this.apiUrl, data);
  }

  getAllPrices(): Observable<PriceConfig[]> {
    return this.http.get<PriceConfig[]>(`${this.apiUrl}/all`);
  }

  savePrice(price: PriceConfig): Observable<PriceConfig> {
    return this.http.post<PriceConfig>(this.apiUrl, price);
  }
  
  
}
