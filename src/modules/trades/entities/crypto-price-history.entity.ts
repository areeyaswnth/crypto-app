import { CryptoType } from 'src/common/enum/crypto-type.enum';
import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('crypto_price_history')
@Index(['crypto_type', 'date'], { unique: true })
export class CryptoPriceHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: CryptoType
  })
  crypto_type: CryptoType;

  @Column({ type: 'date' })
  date: Date;

  @Column('decimal', { 
    precision: 20, 
    scale: 8, 
    comment: 'Opening price of the day' 
  })
  open_price: number;

  @Column('decimal', { 
    precision: 20, 
    scale: 8, 
    comment: 'Closing price of the day' 
  })
  close_price: number;

  @Column('decimal', { 
    precision: 20, 
    scale: 8, 
    comment: 'Highest price of the day' 
  })
  high_price: number;

  @Column('decimal', { 
    precision: 20, 
    scale: 8, 
    comment: 'Lowest price of the day' 
  })
  low_price: number;

  @Column('decimal', { 
    precision: 20, 
    scale: 8, 
    comment: 'Trading volume of the day' 
  })
  volume: number;

  @Column({ 
    type: 'timestamp', 
    default: () => 'CURRENT_TIMESTAMP' 
  })
  created_at: Date;
}