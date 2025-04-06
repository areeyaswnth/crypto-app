import { WalletType } from "../entities/wallet.entity";

export interface CreateWalletPayload {
    name: string;
    initialBalance?: number;
    type: WalletType;
    description?: string;
    userId?: string;

}