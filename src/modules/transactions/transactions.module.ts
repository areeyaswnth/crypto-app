
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletsModule } from '../wallets/wallets.module';
import { AuthModule } from '../auth/auth.module';
import { Transaction } from './entities/transaction.entity';
import { TransactionsController } from './controllers/transactions.controller';
import { TransactionsService } from './services/transactions.service';
import { TransactionsRepository } from './repositories/transactions.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    WalletsModule  ,
    forwardRef(() => AuthModule)
  ],
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    TransactionsRepository,
  ],
  exports: [
    TransactionsService,
    TransactionsRepository,
    TypeOrmModule 
  ]
})
export class TransactionsModule {}