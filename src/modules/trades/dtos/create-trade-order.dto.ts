
import { IsNotEmpty, IsEnum, IsNumber, IsUUID } from 'class-validator';
import { OrderType, OrderStatus } from '../entities/trade-order.entity';
import { CryptoType } from 'src/common/enum/crypto-type.enum';

export class CreateTradeOrderDto {
  @IsNotEmpty()
  @IsEnum(OrderType)
  order_type: OrderType;

  @IsNotEmpty()
  @IsUUID()
  wallet_id: string;

  @IsNotEmpty()
  @IsEnum(CryptoType)
  crypto_type: CryptoType;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsNumber()
  price: number;
}