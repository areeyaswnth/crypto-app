// src/trades/services/crypto-pricing.service.ts
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { CryptoType } from 'src/common/enum/crypto-type.enum';
import { CryptoPriceRepository } from '../repositories/crypto-price.repository';
import { CryptoPriceHistory } from '../entities/crypto-price-history.entity';

@Injectable()
export class CryptoPricingService {
  private readonly logger = new Logger(CryptoPricingService.name);

  constructor(
    private cryptoPriceRepository: CryptoPriceRepository
  ) {}

  async fetchCryptoPrice(crypto_type: CryptoType): Promise<any> {
    try {
      const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price`, {
        params: {
          ids: this.mapCryptoTypeToCoingecko(crypto_type),
          vs_currencies: 'usd',
          include_24hr_change: true,
          include_market_cap: true,
          include_24hr_vol: true
        }
      });

      return response.data;
    } catch (error) {
      this.logger.error(`Failed to fetch price for ${crypto_type}`, error);
      throw new Error(`Unable to fetch price for ${crypto_type}`);
    }
  }

  async updateCryptoPrice(crypto_type: CryptoType): Promise<CryptoPriceHistory> {
    const priceData = await this.fetchCryptoPrice(crypto_type);
    
    const cryptoInfo = priceData[this.mapCryptoTypeToCoingecko(crypto_type)];
    
    const priceHistory = new CryptoPriceHistory();
    priceHistory.crypto_type = crypto_type;
    priceHistory.date = new Date();
    priceHistory.open_price = cryptoInfo.usd;
    priceHistory.close_price = cryptoInfo.usd;
    priceHistory.high_price = cryptoInfo.usd;
    priceHistory.low_price = cryptoInfo.usd;
    priceHistory.volume = cryptoInfo['usd_24h_vol'];

    return this.cryptoPriceRepository.save(priceHistory);
  }

  async getCurrentPrice(crypto_type: CryptoType): Promise<number> {
    const priceData = await this.fetchCryptoPrice(crypto_type);
    return priceData[this.mapCryptoTypeToCoingecko(crypto_type)].usd;
  }

  private mapCryptoTypeToCoingecko(crypto_type: CryptoType): string {
    const mapping = {
      [CryptoType.BTC]: 'bitcoin',
      [CryptoType.ETH]: 'ethereum',
      [CryptoType.USDT]: 'tether',
      [CryptoType.LTC]: 'litecoin',
      [CryptoType.XRP]: 'ripple'
    };
    return mapping[crypto_type] || crypto_type.toLowerCase();
  }
}