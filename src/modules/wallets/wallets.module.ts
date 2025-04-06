import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WalletsController } from './controllers/wallets.controller';
import { WalletsService } from './services/wallets.service';
import { WalletsRepository } from './repositories/wallets.repository';
import { Wallet } from './entities/wallet.entity';
import { HttpModule } from '@nestjs/axios';
// import { AuthModule } from '../auth/auth.module'; // เพิ่ม auth module

@Module({
  imports: [
    TypeOrmModule.forFeature([Wallet]),
    HttpModule,

  ],
  controllers: [WalletsController],
  providers: [
    WalletsService,
    WalletsRepository 
  ],
  exports: [
    WalletsService,
    WalletsRepository,
    TypeOrmModule // Export TypeORM module for use in other modules
  ]
})
export class WalletsModule {}