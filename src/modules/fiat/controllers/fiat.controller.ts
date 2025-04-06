import { Body, Controller, Get, HttpException, HttpStatus, Param, Post ,    Request, UseGuards,} from "@nestjs/common";

import { JwtAuthGuard } from "src/modules/auth/guards/jwt-auth.guard";
import { CreateFiatDto } from "../dtos/create-fiat.dto";
import { FiatService } from "../services/fiat.service";

@Controller('wallets/:wallet_id/fiats')
export class FiatController {
  constructor(private readonly fiatService: FiatService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Param('wallet_id') wallet_id: string,@Request() req,
    @Body() createFiatDto: CreateFiatDto
  ) {
    if (!req.user) {
      throw new HttpException('User not authenticated', HttpStatus.UNAUTHORIZED);
    }
    const userId = req.user.user_id;
    createFiatDto.wallet_id = wallet_id;

    if (!createFiatDto.wallet_id) {
      throw new HttpException('Wallet ID not provided', HttpStatus.BAD_REQUEST);
    }
    if (!createFiatDto.currency) {
      throw new HttpException('Currency not provided', HttpStatus.BAD_REQUEST);
    }
    if (createFiatDto.balance < 0) {
      throw new HttpException('Balance cannot be negative', HttpStatus.BAD_REQUEST);
    }


    createFiatDto.wallet_id = wallet_id;
    try {
      const fiat = await this.fiatService.createFiat(createFiatDto, userId);
      return { message: `Fiat created for ${createFiatDto.wallet_id}`,  fiat: fiat };
    } catch (error) {
      console.error('Fiat Creation Error:', error);
    }
     }

  @Get()
  @UseGuards(JwtAuthGuard)
  async walletFiats(
    @Param('wallet_id') wallet_id: string,
    @Request() req
  ) {
    const userId = req.user.user_id;
    const fiats = await this.fiatService.getFiatsByWalletId(wallet_id, userId);
    if (!fiats) {
      throw new HttpException('No fiats found', HttpStatus.NOT_FOUND);
    }
    return fiats;
  }



  @Post(':currency/deposit')
  @UseGuards(JwtAuthGuard)
  async deposit(
    @Param('wallet_id') wallet_id: string,
    @Param('currency') currency: string,
    @Body('amount') amount: number,@Request() req
  ) {
    return this.fiatService.deposit(wallet_id, currency, amount,req.user.user_id);
  }

  @Post(':currency/withdraw')
  async withdraw(
    @Param('wallet_id') wallet_id: string,
    @Param('currency') currency: string,
    @Body('amount') amount: number,
    @Request() req
  ) {
    return this.fiatService.withdraw(wallet_id, currency, amount,req.user.user_id);
  }
}