import { Controller, Post, Body, Param, UseGuards,Request, HttpException, HttpStatus, Get, Put } from '@nestjs/common';
import { TransactionsService } from '../services/transactions.service';
import { CreateTransactionDto } from '../dtos/create-transaction.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { TransactionStatus } from '../entities/transaction.entity';
import { console } from 'inspector';

@Controller('wallets/wallet/:wallet_id/transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('')
  @UseGuards(JwtAuthGuard)
  async createTransaction(@Body() createTransactionDto: CreateTransactionDto,@Request() req) {
    createTransactionDto.user_id= req.user.user_id;
    if (!req.user) {
      throw new HttpException('User not authenticated', HttpStatus.UNAUTHORIZED);
    }
    createTransactionDto.wallet_id = req.params.wallet_id;
    if (!createTransactionDto.wallet_id) {
      throw new HttpException('Wallet ID not provided', HttpStatus.BAD_REQUEST);
    }
    return this.transactionsService.createTransaction(createTransactionDto);
  }
  @Get()
  @UseGuards(JwtAuthGuard)
  async getTransactions(@Param ('wallet_id') wallet_id,@Request() req) {
    const userId = req.user.user_id;
    if (!userId) {
      throw new HttpException('User ID not provided', HttpStatus.BAD_REQUEST);
    }
    const transactions = await this.transactionsService.getTransactionsByUserId(userId,wallet_id);
    if (!transactions) {
      throw new HttpException('No transactions found', HttpStatus.NOT_FOUND);
    }
    return transactions;
  }

  @Put(':id/status/')
  @UseGuards(JwtAuthGuard)
  async updateTransactionStatus(
    @Param('id') id: string, 
    @Body('status') status: string
,
    @Request() req
  ) {
    if (!req.user) {
      throw new HttpException('User not authenticated', HttpStatus.UNAUTHORIZED);
    }
    if (!id) {
      throw new HttpException('Transaction ID not provided', HttpStatus.BAD_REQUEST);
    }
    if (!status) {
      throw new HttpException('Status not provided', HttpStatus.BAD_REQUEST);
    }
    const validStatuses = Object.values(TransactionStatus);
    console.log('Valid statuses:', validStatuses); 
  ;
    return this.transactionsService.updateTransactionStatus(
      id, 
      status as TransactionStatus
    );
  }
}