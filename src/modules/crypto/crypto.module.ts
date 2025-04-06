// src/crypto/crypto.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CryptoService } from './services/crypto.service';
import { CryptoController } from './controllers/crypto.controller';
import { CryptoEntity } from './entities/crypto.entity';
import { CryptoRepository } from './repositories/crypto.repository';
import { WalletsModule } from '../wallets/wallets.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CryptoEntity]),
    WalletsModule  ,
    forwardRef(() => AuthModule)
  ],
  controllers: [CryptoController],
  providers: [
    CryptoService, 
    CryptoRepository
  ],
  exports: [
    CryptoService, 
    CryptoRepository,
    TypeOrmModule 
  ]
})
export class CryptoModule {}