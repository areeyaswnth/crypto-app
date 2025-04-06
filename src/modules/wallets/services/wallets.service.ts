import { Injectable } from '@nestjs/common';
import { CreateWalletDto } from '../dtos/create-wallet.dto';
import { WalletsRepository } from '../repositories/wallets.repository';
import { Wallet } from '../entities/wallet.entity';


@Injectable()
export class WalletsService {
   
    async deductBalance(wallet_id: string, total_value: number) {
        return this.walletsRepository.deductBalance(wallet_id, total_value);
    }
    async findById(wallet_id: string, user_id: string) {
        return this.walletsRepository.findById(wallet_id, user_id);
    }
    constructor(
      private readonly walletsRepository: WalletsRepository,
    ) {}

  async createDefaultWallet(dto: CreateWalletDto): Promise<Wallet> {
    return await this.walletsRepository.create(dto);
 
  }
  
  async createWalletByType(dto: CreateWalletDto): Promise<Wallet> {

    return await this.walletsRepository.create(dto);
  }

  async getWalletsByUserId(userId: string): Promise<Wallet[]> {
    if (!userId) {
      throw new Error('User ID not provided');
    }
    return await this.walletsRepository.findByUserId(userId);
  }

  async getWalletByWalletId(walletId: string,user_id: string): Promise<Wallet|null> {
    const wallet = await this.walletsRepository.findById(walletId,user_id);
    return wallet;
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