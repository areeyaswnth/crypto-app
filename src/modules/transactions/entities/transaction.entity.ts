import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { CryptoType } from 'src/common/enum/crypto-type.enum';
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
  crypto_type: CryptoType;

  @Column('decimal', { 
    precision: 20, 
    scale: 8 
  })
  amount: number;


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


;
}