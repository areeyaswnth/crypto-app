// src/trades/services/trade-orders.service.ts
import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { TradeOrdersRepository } from '../repositories/trade-orders.repository';
import { CreateTradeOrderDto } from '../dtos/create-trade-order.dto';
import { TradeOrder, OrderStatus, OrderType } from '../entities/trade-order.entity';
import { WalletsService } from 'src/modules/wallets/services/wallets.service';
import { CryptoPricingService } from './crypto-pricing.service';

@Injectable()
export class TradeOrdersService {
  getTradeOrderById(userId: string, orderId: string) {
    return this.tradeOrdersRepository.findOne({ 
      where: { id: orderId, user_id: userId } 
    });
  }
  getTradeOrders(userId: string) {
    return this.tradeOrdersRepository.find({ where: { user_id: userId } });
  }
  constructor(
    private tradeOrdersRepository: TradeOrdersRepository,
    private walletsService: WalletsService,
    private cryptoPricingService: CryptoPricingService
  ) {}async createTradeOrder(
    createTradeOrderDto: CreateTradeOrderDto, 
    user_id: string
  ): Promise<TradeOrder> {
    // ตรวจสอบ user_id
    if (!user_id) {
      throw new UnauthorizedException('User not authenticated');
    }
  
    // ตรวจสอบกระเป๋าเงิน
    const wallet = await this.walletsService.findById(
      createTradeOrderDto.wallet_id, 
      user_id
    );
  
    // ดึงราคาปัจจุบัน
    const currentPrice = await this.cryptoPricingService.getCurrentPrice(
      createTradeOrderDto.crypto_type
    );
  
    // คำนวณมูลค่ารวม
    const total_value = createTradeOrderDto.amount * currentPrice;
  
    // สร้าง Trade Order
    const tradeOrder = this.tradeOrdersRepository.create({
      ...createTradeOrderDto,
      user_id,
      status: OrderStatus.PENDING,
      total_value,  // เพิ่ม total_value
      price: currentPrice  // เพิ่ม current price
    });
  
    return this.tradeOrdersRepository.save(tradeOrder);
  }

  async cancelTradeOrder(order_id: string, user_id: string): Promise<TradeOrder> {
    const order = await this.tradeOrdersRepository.findOne({ 
      where: { id: order_id, user_id } 
    });

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    order.status = OrderStatus.CANCELLED;
    return this.tradeOrdersRepository.save(order);
  }
}