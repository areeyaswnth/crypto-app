import { 
    IsNotEmpty, 
    IsString, 
    IsNumber, 
    Min, 
    IsEnum, 
    IsOptional, 
    IsHash, 
    ValidateNested,
    IsObject
  } from 'class-validator';
  import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
  import { Type } from 'class-transformer';
  
  // Enum for supported cryptocurrencies
  export enum CryptoCurrency {
    BTC = 'BTC',
    ETH = 'ETH',
    USDT = 'USDT',
    BNB = 'BNB',
    SOL = 'SOL'
  }
  
  // Enum for transfer status
  export enum TransferStatus {
    PENDING = 'pending',
    COMPLETED = 'completed',
    FAILED = 'failed',
    PROCESSING = 'processing'
  }
  
  // Blockchain network information
  export class BlockchainNetworkDto {
    @ApiProperty({
      description: 'Blockchain network name',
      example: 'Ethereum'
    })
    @IsString()
    @IsNotEmpty()
    networkName: string;
  
    @ApiProperty({
      description: 'Network chain ID',
      example: 1
    })
    @IsNumber()
    @IsNotEmpty()
    chainId: number;
  }
  
  // Create Crypto Transfer DTO
  export class CreateCryptoTransferDto {
    @ApiProperty({
      description: 'Source wallet ID',
      example: 'wallet_123456'
    })
    @IsString()
    @IsNotEmpty()
    sourceWalletId: string;
  
    @ApiProperty({
      description: 'Destination wallet address',
      example: '0x1234567890123456789012345678901234567890'
    })
    @IsString()
    @IsNotEmpty()
    destinationAddress: string;
  
    @ApiProperty({
      description: 'Amount to transfer',
      example: 0.05
    })
    @IsNumber()
    @Min(0)
    amount: number;
  
    @ApiProperty({
      description: 'Cryptocurrency type',
      enum: CryptoCurrency,
      example: CryptoCurrency.BTC
    })
    @IsEnum(CryptoCurrency)
    currency: CryptoCurrency;
  
    @ApiPropertyOptional({
      description: 'Network details',
      type: BlockchainNetworkDto
    })
    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => BlockchainNetworkDto)
    network?: BlockchainNetworkDto;
  
    @ApiPropertyOptional({
      description: 'Transfer memo or description',
      example: 'Payment for services'
    })
    @IsString()
    @IsOptional()
    memo?: string;
  }
  
  // Crypto Transfer Response DTO
  export class CryptoTransferResponseDto {
    @ApiProperty({
      description: 'Unique transfer ID',
      example: 'transfer_123456'
    })
    id: string;
  
    @ApiProperty({
      description: 'Source wallet ID',
      example: 'wallet_123456'
    })
    sourceWalletId: string;
  
    @ApiProperty({
      description: 'Destination wallet address',
      example: '0x1234567890123456789012345678901234567890'
    })
    destinationAddress: string;
  
    @ApiProperty({
      description: 'Amount transferred',
      example: 0.05
    })
    amount: number;
  
    @ApiProperty({
      description: 'Cryptocurrency type',
      enum: CryptoCurrency,
      example: CryptoCurrency.BTC
    })
    currency: CryptoCurrency;
  
    @ApiProperty({
      description: 'Transfer status',
      enum: TransferStatus,
      example: TransferStatus.PENDING
    })
    status: TransferStatus;
  
    @ApiPropertyOptional({
      description: 'Transaction hash',
      example: '0x1a2b3c4d5e6f7g8h9i0j'
    })
    transactionHash?: string;
  
    @ApiPropertyOptional({
      description: 'Network details',
      type: BlockchainNetworkDto
    })
    network?: BlockchainNetworkDto;
  
    @ApiProperty({
      description: 'Transfer timestamp',
      example: '2023-06-15T10:30:00.000Z'
    })
    createdAt: Date;
  
    @ApiPropertyOptional({
      description: 'Transfer memo or description',
      example: 'Payment for services'
    })
    memo?: string;
  
    @ApiPropertyOptional({
      description: 'Transfer fees',
      example: 0.001
    })
    fees?: number;
  }
  
  // Mapping function for response
  export function mapToCryptoTransferResponseDto(transfer: any): CryptoTransferResponseDto {
    return {
      id: transfer.id,
      sourceWalletId: transfer.sourceWalletId,
      destinationAddress: transfer.destinationAddress,
      amount: transfer.amount,
      currency: transfer.currency,
      status: transfer.status,
      transactionHash: transfer.transactionHash,
      network: transfer.network,
      createdAt: transfer.createdAt,
      memo: transfer.memo,
      fees: transfer.fees
    };
  }