import { Body, Controller, Get, HttpException, HttpStatus, Param, Post ,    Request, UseGuards,} from "@nestjs/common";
import { CreateCryptoDto } from "../dtos/create-crypto.dto";
import { CryptoService } from "../services/crypto.service";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt-auth.guard";

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



}