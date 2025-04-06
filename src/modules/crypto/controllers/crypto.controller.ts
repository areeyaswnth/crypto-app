import { Body, Controller, Get, HttpException, HttpStatus, Param, Post ,    Request, UseGuards,} from "@nestjs/common";
import { CreateCryptoDto } from "../dtos/create-crypto.dto";
import { CryptoService } from "../services/crypto.service";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt-auth.guard";
import { TransactionsService } from "src/modules/transactions/services/transactions.service";
import { TransactionType } from "src/modules/transactions/entities/transaction.entity";
import { CryptoType } from "src/common/enum/crypto-type.enum";

@Controller('wallets/:wallet_id/cryptos')
export class CryptoController {
  constructor(
    private readonly cryptoService: CryptoService,
    private readonly transactionsService: TransactionsService
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Param('wallet_id') wallet_id: string,@Request() req,
    @Body() createCryptoDto: CreateCryptoDto
  ) {
    if (!req.user) {
      throw new HttpException('User not authenticated', HttpStatus.UNAUTHORIZED);
    }
    const userId = req.user.user_id;

    createCryptoDto.wallet_id = wallet_id;
    if (!createCryptoDto.wallet_id) {
      throw new HttpException('Wallet ID not provided', HttpStatus.BAD_REQUEST);
    }
    if (!createCryptoDto.currency) {
      throw new HttpException('Currency not provided', HttpStatus.BAD_REQUEST);
    }
    if (createCryptoDto.balance < 0) {
      throw new HttpException('Balance cannot be negative', HttpStatus.BAD_REQUEST);
    }
    try {
      const crypto = await this.cryptoService.createCrypto(createCryptoDto, userId);
      if (!crypto) {
        throw new HttpException('Failed to create crypto', HttpStatus.INTERNAL_SERVER_ERROR);
      }
      await this.transactionsService.createTransaction({

        user_id: userId,
        wallet_id: wallet_id,
        transaction_type: TransactionType.DEPOSIT, 
        crypto_type: CryptoType[createCryptoDto.currency],
        amount: createCryptoDto.balance,
        description: `Creation of ${createCryptoDto.balance} ${createCryptoDto.currency} in wallet ${wallet_id}`,
      });

      return { message: `Crypto created for ${createCryptoDto.wallet_id}`, crypto };
    } catch (error) {
      console.error('Crypto Creation Error:', error);

    }
     }

  @Get()
  @UseGuards(JwtAuthGuard)
  async walletCryptos(
    @Param('wallet_id') wallet_id: string,
    @Request() req
  ) {
    const userId = req.user.user_id;
    const cryptos = await this.cryptoService.getCryptosByWalletId(wallet_id, userId);
    if (!cryptos) {
      throw new HttpException('No cryptos found', HttpStatus.NOT_FOUND);
    }
    return cryptos;
  }

  @Post(':currency/deposit')
  @UseGuards(JwtAuthGuard)
  async deposit(
    @Param('wallet_id') wallet_id: string,
    @Param('currency') currency: string,
    @Body('amount') amount: number,@Request() req
  ) {
    const crypto=this.cryptoService.deposit(wallet_id, currency, amount,req.user.user_id);
    if (!crypto) {
      throw new HttpException('No cryptos found', HttpStatus.NOT_FOUND);
    }
    await this.transactionsService.createTransaction({
      user_id: req.user.user_id,
      wallet_id: wallet_id,
      transaction_type: TransactionType.DEPOSIT, 
      crypto_type: CryptoType[currency],
      amount: amount,
      description: `Deposit of ${amount} ${currency} to wallet ${wallet_id}`,
    });
    
    return crypto;
  }

  @Post(':currency/withdraw')
  @UseGuards(JwtAuthGuard)
  async withdraw(
    @Param('wallet_id') wallet_id: string,
    @Param('currency') currency: string,
    @Body('amount') amount: number,
    @Request() req
  ) {
    const crypto= await this.cryptoService.withdraw(wallet_id, currency, amount,req.user.user_id);
    if (!crypto) {
      throw new HttpException('No cryptos found', HttpStatus.NOT_FOUND);
    }
    await this.transactionsService.createTransaction({
      user_id: req.user.user_id,
      wallet_id: wallet_id,
      transaction_type: TransactionType.WITHDRAWAL, 
      crypto_type: CryptoType[currency],
      amount: amount,
      description: `Deposit of ${amount} ${currency} to wallet ${wallet_id}`,
    });
    return crypto;
  }



}