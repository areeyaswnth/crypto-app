import { IsNotEmpty, IsEnum, IsPositive, IsOptional, IsString, IsNumber } from 'class-validator';
import { TransactionType } from '../entities/transaction.entity';
import { CryptoType } from '../../../common/enum/crypto-type.enum';
import { FiatType } from '../../../common/enum/fiat-type.enum';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsString()
  user_id: string;

  @IsNotEmpty()
  @IsString()
  wallet_id: string;

  @IsNotEmpty()
  @IsEnum(TransactionType)
  transaction_type: TransactionType;

  @IsNotEmpty()
  @IsEnum(CryptoType)
  crypto_type: CryptoType;


  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount: number;

  @IsOptional()
  @IsString()
  external_address?: string;

  @IsOptional()  
  @IsString()
  description?: string;
}