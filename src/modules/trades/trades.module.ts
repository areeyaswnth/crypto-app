// src/trades/trades.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TradeOrder } from './entities/trade-order.entity';
import { TradeOrdersController } from './controllers/trade-orders.controller';
import { TradeOrdersService } from './services/trade-orders.service';
import { TradeOrdersRepository } from './repositories/trade-orders.repository';
import { WalletsModule } from '../wallets/wallets.module';
import { CryptoPricingModule } from './crypto-pricing.module';
import { AuthModule } from '../auth/auth.module';
import { CryptoModule } from '../crypto/crypto.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TradeOrder]),
    WalletsModule,
    CryptoPricingModule,
    forwardRef(() => AuthModule) ,
    forwardRef(() => CryptoPricingModule),
    CryptoModule
  ],
  controllers: [TradeOrdersController],
  providers: [
    TradeOrdersService, 
    TradeOrdersRepository
  ],
  exports: [TradeOrdersService]
})
export class TradesModule {}