// src/crypto/entities/crypto.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Wallet } from 'src/modules/wallets/entities/wallet.entity';
import { CryptoType } from 'src/common/enum/crypto-type.enum';

@Entity('cryptos')
export class CryptoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: CryptoType,
    nullable: false,
  })
  currency: string; 

  @Column({ type: 'decimal', precision: 20, scale: 10, default: 0 })
  balance: number;

  @JoinColumn({ name: 'wallet_id' })
  wallet: Wallet;

  @Column()
  wallet_id: string;


  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
