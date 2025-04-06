import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Wallet } from '../../wallets/entities/wallet.entity';
import { User } from '../../users/entities/user.entity';
import { CryptoType } from 'src/common/enum/crypto-type.enum';

export enum TransferStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

@Entity('transfers')
export class Transfer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  sender_wallet_id: string;

  @Column()
  recipient_wallet_id: string;

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

  @Column('decimal', { 
    precision: 20, 
    scale: 8, 
    default: 0 
  })
  fee: number;

  @Column({
    type: 'enum',
    enum: TransferStatus,
    default: TransferStatus.PENDING
  })
  status: TransferStatus;

  @Column({ nullable: true })
  transaction_hash?: string;

  @Column({ nullable: true })
  memo?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  transfer_date: Date;

  // Relationships
  @ManyToOne(() => Wallet, wallet => wallet.sent_transfers)
  @JoinColumn({ name: 'sender_wallet_id' })
  sender_wallet: Wallet;

  @ManyToOne(() => Wallet, wallet => wallet.received_transfers)
  @JoinColumn({ name: 'recipient_wallet_id' })
  recipient_wallet: Wallet;
}