import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable, map } from 'rxjs';
import { CreateWalletDto } from '../dtos/create-wallet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { WalletsRepository } from '../repositories/wallets.repository';
import { Wallet } from '../entities/wallet.entity';


@Injectable()
export class WalletsService {
    constructor(
      private readonly walletsRepository: WalletsRepository,
    ) {}
  // getWallets(): Observable<Wallet[]> {
  //   return this.http.get<Wallet[]>(this.apiUrl).pipe(map(response => response.data));
  // }

  // getWallet(id: string): Observable<Wallet> {
  //   const url = `${this.apiUrl}/${id}`;
  //   return this.http.get<Wallet>(url).pipe(map(response => response.data));
  // }

  async createWallet(dto: CreateWalletDto): Promise<Wallet> {
    return await this.walletsRepository.create(dto);
 
  }

  // updateWallet(wallet: Wallet): Observable<Wallet> {
  //   const url = `${this.apiUrl}/${wallet.id}`;
  //   return this.http.put<Wallet>(url, wallet).pipe(map(response => response.data));
  // }

  // deleteWallet(id: string): Observable<void> {
  //   const url = `${this.apiUrl}/${id}`;
  //   return this.http.delete<void>(url).pipe(map(response => response.data));
  // }
}