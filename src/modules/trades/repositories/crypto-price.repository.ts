// src/trades/repositories/crypto-price.repository.ts
import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { CryptoPriceHistory } from '../entities/crypto-price-history.entity';
import { CryptoType } from 'src/common/enum/crypto-type.enum';

@Injectable()
export class CryptoPriceRepository extends Repository<CryptoPriceHistory> {
  constructor(private dataSource: DataSource) {
    super(CryptoPriceHistory, dataSource.createEntityManager());
  }

  async getLatestPrice(crypto_type: CryptoType): Promise<CryptoPriceHistory | null> {
    return this.findOne({
      where: { crypto_type },
      order: { date: 'DESC' }
    });
  }

  async getPriceHistory(
    crypto_type: CryptoType, 
    days: number = 30
  ): Promise<CryptoPriceHistory[]> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    return this.createQueryBuilder('price_history')
      .where('price_history.crypto_type = :crypto_type', { crypto_type })
      .andWhere('price_history.date BETWEEN :startDate AND :endDate', { 
        startDate, 
        endDate 
      })
      .orderBy('price_history.date', 'ASC')
      .getMany();
  }
}