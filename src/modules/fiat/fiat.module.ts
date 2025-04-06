
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletsModule } from '../wallets/wallets.module';
import { AuthModule } from '../auth/auth.module';
import { FiatEntity } from './entities/fiat.entity';
import { FiatController } from './controllers/fiat.controller';
import { FiatService } from './services/fiat.service';
import { FiatRepository } from './repositories/fiat.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([FiatEntity]),
    WalletsModule  ,
    forwardRef(() => AuthModule)
  ],
  controllers: [FiatController],
  providers: [
    FiatService, 
    FiatRepository
  ],
  exports: [
    FiatService,
    FiatRepository,
    TypeOrmModule 
  ]
})
export class FiatModule {}