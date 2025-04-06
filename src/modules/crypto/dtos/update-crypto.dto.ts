import { CryptoType } from "src/common/enum/crypto-type.enum";
export class UpdateCryptoDto {
    balance?: number;
    current_price?: number;
    is_active?: boolean;
    currency?: CryptoType
  }