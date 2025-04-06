import { Body, Controller, Get, HttpException, HttpStatus, Param, Post ,    Request, UseGuards,} from "@nestjs/common";
import { CreateCryptoDto } from "../dtos/create-crypto.dto";
import { CryptoService } from "../services/crypto.service";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt-auth.guard";

// src/crypto/crypto.controller.ts
@Controller('wallets/:wallet_id/cryptos')
export class CryptoController {
  constructor(private readonly cryptoService: CryptoService) {}

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
    try {
      const crypto = await this.cryptoService.createCrypto(createCryptoDto, userId);
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
  async deposit(
    @Param('wallet_id') wallet_id: string,
    @Param('currency') currency: string,
    @Body('amount') amount: number,@Request() req
  ) {
    return this.cryptoService.deposit(wallet_id, currency, amount,req.user.user_id);
  }

  @Post(':currency/withdraw')
  async withdraw(
    @Param('wallet_id') wallet_id: string,
    @Param('currency') currency: string,
    @Body('amount') amount: number,
    @Request() req
  ) {
    return this.cryptoService.withdraw(wallet_id, currency, amount,req.user.user_id);
  }
}