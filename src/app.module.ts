import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { WalletsModule } from './modules/wallets/wallets.module';
import { AuthModule } from './modules/auth/auth.module';
import { CryptoModule } from './modules/crypto/crypto.module';
import { FiatModule } from './modules/fiat/fiat.module';
//import { WalletsModule } from './modules/wallets/wallets.module';
//import { TransactionsModule } from './modules/transactions/transactions.module';
//import { TradesModule } from './modules/trades/trades.module';
//import { ExchangesModule } from './modules/exchanges/exchanges.module';

@Module({
  imports: [
    // Configuration Module
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development', '.env']
    }),
    
    // Database Connection
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST',),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: process.env.NODE_ENV !== 'production',
        logging: process.env.NODE_ENV !== 'production'
      }),
      inject: [ConfigService]
    }),

    // Feature Modules
    UsersModule,
     AuthModule,
    WalletsModule,
    CryptoModule,
    FiatModule
    // TransactionsModule,
    // TradesModule,
    // ExchangesModule
  ],
  controllers: [AppController],
  providers: [AppService],
  
}
)
export class AppModule {
  
}