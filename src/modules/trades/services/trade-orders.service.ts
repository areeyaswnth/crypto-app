// src/trades/services/trade-orders.service.ts
import { Injectable, BadRequestException, UnauthorizedException, Logger } from '@nestjs/common';
import { TradeOrdersRepository } from '../repositories/trade-orders.repository';
import { CreateTradeOrderDto } from '../dtos/create-trade-order.dto';
import { TradeOrder, OrderStatus, OrderType } from '../entities/trade-order.entity';
import { WalletsService } from 'src/modules/wallets/services/wallets.service';
import { CryptoPricingService } from './crypto-pricing.service';
import { CryptoService } from 'src/modules/crypto/services/crypto.service';

@Injectable()
export class TradeOrdersService {
  getTradeOrderById(userId: string, orderId: string) {
      return this.tradeOrdersRepository.findOne({
        where: { id: orderId, user_id: userId },
        relations: ['wallet'],
        });
  }
  getTradeOrders(userId: string) {
      return this.tradeOrdersRepository.findByUser(userId);
  }
  private readonly logger = new Logger(TradeOrdersService.name);

  constructor(
    private tradeOrdersRepository: TradeOrdersRepository,
    private walletsService: WalletsService,
    private cryptoPricingService: CryptoPricingService,
    private cryptoService: CryptoService
  ) {}

  async createTradeOrder(
    createTradeOrderDto: CreateTradeOrderDto, 
    user_id: string
  ): Promise<TradeOrder> {
    if (!user_id) {
      throw new UnauthorizedException('User not authenticated');
    }

    const currentPrice = await this.cryptoPricingService.getCurrentPrice(
      createTradeOrderDto.crypto_type  
    );

    const total_value = createTradeOrderDto.amount * currentPrice;

    const tradeOrder = this.tradeOrdersRepository.create({
      ...createTradeOrderDto,
      user_id,
      status: OrderStatus.PENDING,
      total_value,
      price: currentPrice
    });

    const savedOrder = await this.tradeOrdersRepository.save(tradeOrder);
    
    if (createTradeOrderDto.order_type === OrderType.BUY) {
      await this.processBuyOrder(savedOrder);
    } else {
      await this.processSellOrder(savedOrder);
    }

    return savedOrder;
  }

  private async processBuyOrder(order: TradeOrder): Promise<void> {
    try {
      order.status = OrderStatus.EXECUTED;
      await this.tradeOrdersRepository.save(order);
    } catch (error) {
      order.status = OrderStatus.FAILED;
      await this.tradeOrdersRepository.save(order);
      
      this.logger.error('Buy order processing failed', error);
      throw new BadRequestException('Failed to process buy order');
    }
  }
  
  private async processSellOrder(order: TradeOrder): Promise<void> {
    try {
      order.status = OrderStatus.EXECUTED;
      await this.tradeOrdersRepository.save(order);  
    } catch (error) {
      order.status = OrderStatus.FAILED;
      await this.tradeOrdersRepository.save(order);
      
      this.logger.error('Sell order processing failed', error);
      throw new BadRequestException('Failed to process sell order');
    }
  }
}