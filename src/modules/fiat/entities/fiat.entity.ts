
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Wallet } from 'src/modules/wallets/entities/wallet.entity';
import { FiatType } from 'src/common/enum/fiat-type.enum';

@Entity('fiats')
export class FiatEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: FiatType,
    nullable: false,
  })
  currency: string; 

  @Column({ type: 'decimal', precision: 20, scale: 5, default: 0 })
  balance: number;

  @JoinColumn({ name: 'wallet_id' })
  wallet: Wallet;

  @Column()
  wallet_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
