// src/crypto/crypto.repository.ts
import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CryptoEntity } from '../entities/crypto.entity';

@Injectable()
export class CryptoRepository extends Repository<CryptoEntity> {
  constructor(private dataSource: DataSource) {
    super(CryptoEntity, dataSource.createEntityManager());
  }

  async findByWalletAndCurrency(wallet_id: string, currency: string): Promise<CryptoEntity | null> {
    return this.findOne({ 
      where: { 
        wallet_id, 
        currency 
      } 
    });
  }

  async addBalance(id: string, amount: number): Promise<void> {
    await this.createQueryBuilder()
      .update(CryptoEntity)
      .set({ 
        balance: () => `balance + ${amount}` 
      })
      .where('id = :id', { id })
      .execute();
  }
}