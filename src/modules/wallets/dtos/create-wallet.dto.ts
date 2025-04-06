import { IsNotEmpty, IsNumber, IsOptional, IsString, Min, MaxLength, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { WalletsService } from '../services/wallets.service';
import { CryptoType } from '../entities/wallet.entity';

// Enum for wallet types
export enum WalletType {
  PERSONAL = 'personal',
  BUSINESS = 'business',
  SAVINGS = 'savings',
  INVESTMENT = 'investment'
}

export class CreateWalletDto {
  @ApiProperty({
    description: 'Name of the wallet',
    example: 'My Main Wallet',
    maxLength: 100
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;


  @ApiProperty({
      description: 'Type of cryptocurrency',
      example: 'BTC',
      enum: CryptoType,
    })

  @IsEnum(CryptoType)
  @IsNotEmpty()
  @MaxLength(3)
  crypto_type: CryptoType;


  @ApiProperty({
    description: 'Unique address of the wallet',
    example: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'
  })
  wallet_address: string;
  available_balance?: number=0;
  locked_balance?: number=0;
  total_balance?: number=0;

  @ApiPropertyOptional({
    description: 'Initial balance of the wallet',
    example: 0,
    minimum: 0
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  initialBalance?: number = 0;

  @ApiProperty({
    description: 'Type of wallet',
    enum: WalletType,
    example: WalletType.PERSONAL
  })
  @IsEnum(WalletType)
  type: WalletType = WalletType.PERSONAL;

  @ApiPropertyOptional({
    description: 'Description of the wallet',
    example: 'My primary spending wallet',
    maxLength: 255
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  description?: string;

  @ApiPropertyOptional({
    description: 'User ID who owns the wallet',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsString()
  @IsOptional()
  userId?: string;
}
