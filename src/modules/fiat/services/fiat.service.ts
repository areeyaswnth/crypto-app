// src/crypto/crypto.service.ts
import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { WalletsRepository } from 'src/modules/wallets/repositories/wallets.repository';

import { CreateFiatDto } from '../dtos/create-fiat.dto';
import { FiatRepository } from '../repositories/fiat.repository';
import { FiatEntity } from '../entities/fiat.entity';
import { FiatType } from 'src/common/enum/fiat-type.enum';
@Injectable()
export class FiatService {
  constructor(
    private fiatRepository: FiatRepository,
    private walletRepository: WalletsRepository 
  ) {}

  async createFiat(createFiatDto: CreateFiatDto,user_id:string): Promise<FiatEntity> {

    const wallet = await this.walletRepository.findById(
      createFiatDto.wallet_id,
        user_id
    );

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    const existingFiat = await this.fiatRepository.findByWalletAndCurrency(
      createFiatDto.wallet_id, 
      createFiatDto.currency
    );

    if (existingFiat) {
        await this.fiatRepository.addBalance(existingFiat.id, createFiatDto.balance);
        const updatedFiatdto = await this.fiatRepository.findOne({ where: { id: existingFiat.id } });
        if (!updatedFiatdto) {
          throw new NotFoundException('Updated fiat not found');
        }
        return updatedFiatdto;
    }
    else{
        const fiat = this.fiatRepository.create(createFiatDto);
        return this.fiatRepository.save(fiat) as Promise<FiatEntity>;
    }

  }
  async getFiatsByWalletId(wallet_id, userId): Promise<FiatEntity[]> {
    const wallet = await this.walletRepository.findById(wallet_id, userId);
    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }
    return this.fiatRepository.find({ where: { wallet_id } });
  }
  async deposit(
    wallet_id: string, 
    currency: string, 
    amount: number,
    user_id: string
  ): Promise<FiatEntity> {
    const wallet = await this.walletRepository.findById(wallet_id, user_id);
    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }
    const currency_map = currency as FiatType;
  
    if (!Object.values(FiatType).includes(currency_map)) {
      throw new BadRequestException('Invalid cryptocurrency');
    }
  
    const fiat = await this.fiatRepository.findByWalletAndCurrency(wallet_id, currency);
    
    if (!fiat) {
      return this.createFiat({
        currency: currency_map,
        balance: amount,
        wallet_id: wallet_id,
      }, user_id);
    }
  
    await this.fiatRepository.addBalance(fiat.id, amount);
    const foundFiat = await this.fiatRepository.findOne({ where: { id: fiat.id } });
    if (!foundFiat) {
      throw new NotFoundException('Fiat not found');
    }
    return foundFiat;
  }
  async withdraw(wallet_id: string, currency: string, amount: number,user_id:string): Promise<FiatEntity> {
    const fiat = await this.fiatRepository.findByWalletAndCurrency(wallet_id, currency);
    
    if (!fiat) {
      throw new NotFoundException('fiat not found in this wallet');
    }

    if (fiat.balance < amount) {
      throw new BadRequestException('Insufficient balance');
    }

    await this.fiatRepository.addBalance(fiat.id, -amount);
    const updatedFiat = await this.fiatRepository.findOne({ where: { id: fiat.id } });
    if (!updatedFiat) {
      throw new NotFoundException('fiat not found');
    }
    return updatedFiat;
  }
  async getFiatByWallet(wallet_id: string, user_id: string): Promise<FiatEntity[]> {
    const wallet = await this.walletRepository.findById(wallet_id, user_id);
    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }
  
    return this.fiatRepository.find({ 
      where: { wallet_id },
      order: { balance: 'DESC' }
    });
  }

}