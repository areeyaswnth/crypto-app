import { CryptoType } from "src/common/enum/crypto-type.enum";
// src/crypto/dtos/create-crypto.dto.ts
import { IsNotEmpty, IsEnum, IsNumber, IsString, Min } from 'class-validator';

export class CreateCryptoDto {
  @IsNotEmpty()
  @IsEnum(CryptoType)
  currency: CryptoType;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  balance: number;

  @IsNotEmpty()
  @IsString()
  wallet_id: string;

}