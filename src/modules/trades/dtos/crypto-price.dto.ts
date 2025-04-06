// src/trades/dtos/crypto-price.dto.ts
import { CryptoType } from 'src/common/enum/crypto-type.enum';

export class CryptoPriceDto {
  crypto_type: CryptoType;
  current_price: number;
  price_change_24h: number;
  market_cap: number;
  volume_24h: number;
}