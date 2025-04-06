import { FiatType } from "src/common/enum/fiat-type.enum";
export class UpdateFiatDto {
    balance?: number;
    current_price?: number;
    currency?: FiatType
  }