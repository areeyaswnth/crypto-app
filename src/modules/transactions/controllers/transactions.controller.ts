import { Controller, Post, Body, Param, UseGuards,Request, HttpException, HttpStatus } from '@nestjs/common';
import { TransactionsService } from '../services/transactions.service';
import { CreateTransactionDto } from '../dtos/create-transaction.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { TransactionStatus } from '../entities/transaction.entity';

@Controller('')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('wallets/wallet/:id/transactions')
  @UseGuards(JwtAuthGuard)
  async createTransaction(@Param('id') wallet_id:string,@Body() createTransactionDto: CreateTransactionDto,@Request() req) {
    createTransactionDto.user_id= req.user.user_id;
    createTransactionDto.wallet_id = wallet_id;
    return this.transactionsService.createTransaction(createTransactionDto);
  }

  @Post('wallets/wallet/:id/transactions/status')
  @UseGuards(JwtAuthGuard)
  async updateTransactionStatus(
    @Param('id') id: string, 
    @Body() status:string,
    @Request() req
  ) {
    if (!req.user) {
      throw new HttpException('User not authenticated', HttpStatus.UNAUTHORIZED);
    }
    const userId = req.user.user_id;
    return this.transactionsService.updateTransactionStatus(
      id, 
      status as TransactionStatus
    );
  }
}