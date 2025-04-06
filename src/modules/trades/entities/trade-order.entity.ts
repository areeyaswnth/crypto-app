import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Wallet } from '../../wallets/entities/wallet.entity';

export enum OrderType {
  BUY = 'buy',
  SELL = 'sell',
  LIMIT = 'limit',
  MARKET = 'market'
}

export enum OrderStatus {
  PENDING = 'pending',
  EXECUTED = 'executed',
  CANCELLED = 'cancelled',
  FAILED = 'failed'
}

@Entity('trade_orders')
export class TradeOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: OrderType
  })
  order_type: OrderType;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING
  })
  status: OrderStatus;

  @Column()
  user_id: string;

  @Column()
  wallet_id: string;

  @Column({ type: 'varchar', length: 10 })
  crypto_type: string; 

  @Column('decimal', { precision: 20, scale: 8 })
  amount: number;

  @Column('decimal', { precision: 20, scale: 8 })
  price: number;

  @Column('decimal', { precision: 20, scale: 8 })
  total_value: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  order_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  executed_at?: Date;

  Relationships
  @ManyToOne(() => User, user => user.trade_orders)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Wallet, wallet => wallet.trade_orders)
  @JoinColumn({ name: 'wallet_id' })
  wallet: Wallet;
}