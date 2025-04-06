import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Transaction } from '../../transactions/entities/transaction.entity';
export enum ExchangeStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  MAINTENANCE = 'maintenance'
}

@Entity('exchanges')
export class Exchange {
  @PrimaryGeneratedColumn('uuid')
  exchange_id: string;

  @Column()
  exchange_name: string;

  @Column({ unique: true })
  exchange_code: string;

  @Column({
    type: 'enum',
    enum: ExchangeStatus,
    default: ExchangeStatus.ACTIVE
  })
  status: ExchangeStatus;

  @Column('decimal', { 
    precision: 20, 
    scale: 8 
  })
  transaction_fee: number;

  @Column('simple-array')
  supported_crypto_types: string[];

  @Column({ nullable: true })
  api_endpoint?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ 
    type: 'timestamp', 
    default: () => 'CURRENT_TIMESTAMP', 
    onUpdate: 'CURRENT_TIMESTAMP' 
  })
  updated_at: Date;

  @Column({ nullable: true })
  description?: string;

  // Relationships
  @OneToMany(() => Transaction, transaction => transaction.exchange)
  transactions: Transaction[];
}