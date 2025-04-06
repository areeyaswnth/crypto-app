
import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { FiatEntity } from '../entities/fiat.entity';


@Injectable()
export class FiatRepository extends Repository<FiatEntity> {
  constructor(private dataSource: DataSource) {
    super(FiatEntity, dataSource.createEntityManager());
  }

  async findByWalletAndCurrency(wallet_id: string, currency: string): Promise<FiatEntity | null> {
    return this.findOne({ 
      where: { 
        wallet_id, 
        currency 
      } 
    });
  }

  async addBalance(id: string, amount: number): Promise<void> {
    await this.createQueryBuilder()
      .update(FiatEntity)
      .set({ 
        balance: () => `balance + ${amount}` 
      })
      .where('id = :id', { id })
      .execute();
  }
}