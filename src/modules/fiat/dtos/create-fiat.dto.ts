import { IsNotEmpty, IsEnum, IsNumber, IsString, Min } from 'class-validator';
import { FiatType } from "src/common/enum/fiat-type.enum";

export class CreateFiatDto {
  @IsNotEmpty()
  @IsEnum(FiatType)
  currency: FiatType;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  balance: number;

  @IsNotEmpty()
  @IsString()
  wallet_id: string;

}