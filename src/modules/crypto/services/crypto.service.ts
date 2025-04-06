// src/crypto/crypto.service.ts
import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CryptoRepository } from '../repositories/crypto.repository';
import { CreateCryptoDto } from '../dtos/create-crypto.dto';
import { UpdateCryptoDto } from '../dtos/update-crypto.dto';
import { CryptoCurrency } from 'src/modules/wallets/dtos/transfer-crypto';
import { WalletsRepository } from 'src/modules/wallets/repositories/wallets.repository';
import { CryptoEntity,  } from '../entities/crypto.entity';
import { CryptoType } from 'src/common/enum/crypto-type.enum';
@Injectable()
export class CryptoService {
  constructor(
    private cryptoRepository: CryptoRepository,
    private walletRepository: WalletsRepository 
  ) {}

  async createCrypto(createCryptoDto: CreateCryptoDto,user_id:string): Promise<CryptoEntity> {

    const wallet = await this.walletRepository.findById(
      createCryptoDto.wallet_id,
        user_id
    );

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    const existingCrypto = await this.cryptoRepository.findByWalletAndCurrency(
      createCryptoDto.wallet_id, 
      createCryptoDto.currency
    );

    if (existingCrypto) {
        await this.cryptoRepository.addBalance(existingCrypto.id, createCryptoDto.balance);
        const updatedCrypto = await this.cryptoRepository.findOne({ where: { id: existingCrypto.id } });
        if (!updatedCrypto) {
          throw new NotFoundException('Updated crypto not found');
        }
        return updatedCrypto;
    }
    else{
        const crypto = this.cryptoRepository.create(createCryptoDto);
        return this.cryptoRepository.save(crypto) as Promise<CryptoEntity>;
    }

  }
  async getCryptosByWalletId(wallet_id, userId): Promise<CryptoEntity[]> {
    const wallet = await this.walletRepository.findById(wallet_id, userId);
    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }
    return this.cryptoRepository.find({ where: { wallet_id } });
  }
  async getCryptosByWallet(wallet_id: string, user_id: string): Promise<CryptoEntity[]> {
    const wallet = await this.walletRepository.findById(wallet_id, user_id);
    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }
  
    return this.cryptoRepository.find({ 
      where: { wallet_id },
      order: { balance: 'DESC' }
    });
  }

}