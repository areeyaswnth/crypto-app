import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Wallet } from '../../wallets/entities/wallet.entity';
export enum TransactionType {
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
  TRADE = 'trade',
  TRANSFER = 'transfer',
  EXCHANGE = 'exchange'
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export enum CryptoType {
  BITCOIN = 'BTC',
  ETHEREUM = 'ETH',
  RIPPLE = 'XRP',
  DOGECOIN = 'DOGE'
}

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  transaction_id: string;

  @Column()
  user_id: string;

  @Column()
  wallet_id: string;

  @Column({
    type: 'enum',
    enum: TransactionType
  })
  transaction_type: TransactionType;

  @Column({
    type: 'enum',
    enum: CryptoType
  })
  currency_type: CryptoType;

  @Column('decimal', { 
    precision: 20, 
    scale: 8 
  })
  amount: number;

  @Column('decimal', { 
    precision: 20, 
    scale: 8, 
    default: 0 
  })
  fee: number;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING
  })
  status: TransactionStatus;

  @Column({ nullable: true })
  external_address?: string;

  @Column({ nullable: true })
  transaction_hash?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  transaction_date: Date;

  @Column({ nullable: true })
  description?: string;

  // Optional Exchange Details
  @Column({ nullable: true })
  exchange_id?: string;
;
}