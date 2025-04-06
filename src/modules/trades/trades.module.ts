// src/trades/trades.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TradeOrder } from './entities/trade-order.entity';
import { TradeOrdersController } from './controllers/trade-orders.controller';
import { TradeOrdersService } from './services/trade-orders.service';
import { TradeOrdersRepository } from './repositories/trade-orders.repository';
import { WalletsModule } from '../wallets/wallets.module';
import { CryptoPricingModule } from './crypto-pricing.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TradeOrder]),
    WalletsModule,
    CryptoPricingModule,
  ],
  controllers: [TradeOrdersController],
  providers: [
    TradeOrdersService, 
    TradeOrdersRepository
  ],
  exports: [TradeOrdersService]
})
export class TradesModule {}