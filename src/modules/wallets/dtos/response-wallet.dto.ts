import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

// Enum matching the one in CreateWalletDto
export enum WalletType {
  PERSONAL = 'personal',
  BUSINESS = 'business',
  SAVINGS = 'savings',
  INVESTMENT = 'investment'
}

export class WalletResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the wallet',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Name of the wallet',
    example: 'My Main Wallet'
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'Type of wallet',
    enum: WalletType,
    example: WalletType.PERSONAL
  })
  @Expose()
  type: WalletType;

  @ApiProperty({
    description: 'Current balance of the wallet',
    example: 5000.00
  })
  @Expose()
  balance: number;

  @ApiPropertyOptional({
    description: 'Description of the wallet',
    example: 'Primary spending wallet'
  })
  @Expose()
  description?: string;

  @ApiPropertyOptional({
    description: 'User ID who owns the wallet',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @Expose()
  userId?: string;

  @ApiProperty({
    description: 'Timestamp of wallet creation',
    example: '2023-06-15T10:30:00.000Z'
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp of last wallet update',
    example: '2023-06-15T10:30:00.000Z'
  })
  @Expose()
  updatedAt: Date;

  @ApiPropertyOptional({
    description: 'Additional wallet metadata',
    type: 'object',
    example: { 
      currency: 'THB', 
      isActive: true 
    },
    additionalProperties: true
  })
  @Expose()
  metadata?: Record<string, any>;
}

// Pagination response for multiple wallets
export class WalletPaginationResponseDto {
  @ApiProperty({
    description: 'List of wallets',
    type: [WalletResponseDto]
  })
  @Type(() => WalletResponseDto)
  data: WalletResponseDto[];

  @ApiProperty({
    description: 'Total number of wallets',
    example: 10
  })
  total: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1
  })
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10
  })
  limit: number;
}

// Example of mapping function
export function mapToWalletResponseDto(wallet: any): WalletResponseDto {
  return {
    id: wallet.id,
    name: wallet.name,
    type: wallet.type,
    balance: wallet.balance,
    description: wallet.description,
    userId: wallet.userId,
    createdAt: wallet.createdAt,
    updatedAt: wallet.updatedAt,
    metadata: wallet.metadata
  };
}