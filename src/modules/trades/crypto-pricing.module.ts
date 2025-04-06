// src/trades/crypto-pricing.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CryptoPriceHistory } from './entities/crypto-price-history.entity';
import { CryptoPricingService } from './services/crypto-pricing.service';
import { CryptoPriceRepository } from './repositories/crypto-price.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([CryptoPriceHistory])
  ],
  providers: [
    CryptoPricingService,
    CryptoPriceRepository
  ],
  exports: [CryptoPricingService]
})
export class CryptoPricingModule {}