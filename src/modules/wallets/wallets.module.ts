import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WalletsController } from './controllers/wallets.controller';
import { WalletsService } from './services/wallets.service';
import { WalletsRepository } from './repositories/wallets.repository';
import { Wallet } from './entities/wallet.entity';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from '../auth/auth.module'; 
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wallet]),
    HttpModule,
    forwardRef(() => AuthModule), 
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