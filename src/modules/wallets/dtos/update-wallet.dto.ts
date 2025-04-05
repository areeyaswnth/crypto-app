import { ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsOptional, 
  IsString, 
  MaxLength, 
  IsEnum, 
  IsNumber, 
  Min 
} from 'class-validator';

// Enum should match the one in CreateWalletDto
export enum WalletType {
  PERSONAL = 'personal',
  BUSINESS = 'business',
  SAVINGS = 'savings',
  INVESTMENT = 'investment'
}

export class UpdateWalletDto {
  @ApiPropertyOptional({
    description: 'New name for the wallet',
    example: 'Updated Wallet Name'
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({
    description: 'Wallet type',
    enum: WalletType,
    example: WalletType.SAVINGS
  })
  @IsOptional()
  @IsEnum(WalletType)
  type?: WalletType;

  @ApiPropertyOptional({
    description: 'Wallet description',
    example: 'Updated wallet description'
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @ApiPropertyOptional({
    description: 'Additional metadata for the wallet',
    example: { currency: 'THB', isActive: true }
  })
  @IsOptional()
  metadata?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Adjust wallet balance (use positive or negative values)',
    example: 1000.00
  })
  @IsOptional()
  @IsNumber()
  balanceAdjustment?: number;
}