import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable, map } from 'rxjs';

export interface Wallet {
  id: string;
  name: string;
  balance: number;
  // Add any other properties as needed
}

@Injectable()
export class WalletsService {
  private apiUrl = '/api/wallets'; // Replace with your API endpoint

  constructor(private readonly http: HttpService) {}

  getWallets(): Observable<Wallet[]> {
    return this.http.get<Wallet[]>(this.apiUrl).pipe(map(response => response.data));
  }

  getWallet(id: string): Observable<Wallet> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Wallet>(url).pipe(map(response => response.data));
  }

  createWallet(wallet: Wallet): Observable<Wallet> {
    return this.http.post<Wallet>(this.apiUrl, wallet).pipe(map(response => response.data));
  }

  updateWallet(wallet: Wallet): Observable<Wallet> {
    const url = `${this.apiUrl}/${wallet.id}`;
    return this.http.put<Wallet>(url, wallet).pipe(map(response => response.data));
  }

  deleteWallet(id: string): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url).pipe(map(response => response.data));
  }
}