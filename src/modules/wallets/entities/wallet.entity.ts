import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { TradeOrder } from '../../trades/entities/trade-order.entity';
import { Transfer } from '../../transactions/entities/transfer.entity';

export enum WalletType {
  MAIN = 'main',
  PERSONAL = 'personal',
  BUSINESS = 'business',
  SAVINGS = 'savings',
  INVESTMENT = 'investment'
}

@Entity('wallets')
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  wallet_id: string;

  @Column()
  user_id: string;

  @Column({
    type: 'enum',
    enum: WalletType,
    default: WalletType.MAIN
  })
  wallet_type: WalletType;


  @Column({ 
    type: 'varchar', 
    unique: true 
  })
  wallet_address: string;

  @Column({ 
    type: 'decimal', 
    precision: 20, 
    scale: 8, 
    default: 0 
  })

  @Column({ 
    type: 'decimal', 
    precision: 20, 
    scale: 8, 
    default: 0 
  })

  @Column({ 
    type: 'decimal', 
    precision: 20, 
    scale: 8, 
    default: 0 
  })

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ 
    type: 'timestamp', 
    default: () => 'CURRENT_TIMESTAMP', 
    onUpdate: 'CURRENT_TIMESTAMP' 
  })
  updated_at: Date;

  // Relationships
  @ManyToOne(() => User, user => user.wallets)
  @JoinColumn({ name: 'user_id' })
  user: User;

//   @OneToMany(() => TradeOrder, tradeOrder => tradeOrder.wallet)
  trade_orders: TradeOrder[];

//   @OneToMany(() => Transfer, transfer => transfer.sender_wallet)
  sent_transfers: Transfer[];

//   @OneToMany(() => Transfer, transfer => transfer.recipient_wallet)
  received_transfers: Transfer[];
    
}