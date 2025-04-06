import { Injectable } from '@nestjs/common';
import { CreateWalletDto } from '../dtos/create-wallet.dto';
import { WalletsRepository } from '../repositories/wallets.repository';
import { Wallet } from '../entities/wallet.entity';


@Injectable()
export class WalletsService {
   
 
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


}