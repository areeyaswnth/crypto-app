// src/trades/repositories/trade-orders.repository.ts
import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { TradeOrder, OrderStatus } from '../entities/trade-order.entity';

@Injectable()
export class TradeOrdersRepository extends Repository<TradeOrder> {
  constructor(private dataSource: DataSource) {
    super(TradeOrder, dataSource.createEntityManager());
  }

  async findByUser(user_id: string): Promise<TradeOrder[]> {
    return this.find({ 
      where: { user_id },
      order: { order_date: 'DESC' }
    });
  }

  async findActiveTrades(user_id: string): Promise<TradeOrder[]> {
    return this.find({
      where: { 
        user_id, 
        status: OrderStatus.PENDING 
      }
    });
  }
}