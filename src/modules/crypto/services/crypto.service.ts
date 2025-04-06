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
  findByWalletAndCurrency(wallet_id: string, crypto_type: CryptoType) {
      return this.cryptoRepository.findByWalletAndCurrency(wallet_id, crypto_type);
  }
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
        this.cryptoRepository.addBalance(existingCrypto.id, createCryptoDto.balance);
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
  async deposit(
    wallet_id: string, 
    currency: string, 
    amount: number,
    user_id: string
  ): Promise<CryptoEntity> {
    const wallet = await this.walletRepository.findById(wallet_id, user_id);
    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }
    const currency_map = currency as CryptoType;
  
    if (!Object.values(CryptoType).includes(currency_map)) {
      throw new BadRequestException('Invalid cryptocurrency');
    }
  
    const crypto = await this.cryptoRepository.findByWalletAndCurrency(wallet_id, currency);
    
    if (!crypto) {
      return this.createCrypto({
        currency: currency_map,
        balance: amount,
        wallet_id: wallet_id,
      }, user_id);
    }
  
    await this.cryptoRepository.addBalance(crypto.id, amount);
    const foundCrypto = await this.cryptoRepository.findOne({ where: { id: crypto.id } });
    if (!foundCrypto) {
      throw new NotFoundException('Crypto not found');
    }
    return foundCrypto;
  }

  async withdraw(wallet_id: string, currency: string, amount: number,user_id:string): Promise<CryptoEntity> {
      const fiat = await this.cryptoRepository.findByWalletAndCurrency(wallet_id, currency);
      
      if (!fiat) {
        throw new NotFoundException('fiat not found in this wallet');
      }
  
      if (fiat.balance < amount) {
        throw new BadRequestException('Insufficient balance');
      }
  
      await this.cryptoRepository.addBalance(fiat.id, -amount);
      const updatedFiat = await this.cryptoRepository.findOne({ where: { id: fiat.id } });
      if (!updatedFiat) {
        throw new NotFoundException('fiat not found');
      }
      return updatedFiat;
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