import { Controller, Post, Body, Param, UseGuards,Request, HttpException, HttpStatus } from '@nestjs/common';
import { TransactionsService } from '../services/transactions.service';
import { CreateTransactionDto } from '../dtos/create-transaction.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { TransactionStatus } from '../entities/transaction.entity';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createTransaction(@Body() createTransactionDto: CreateTransactionDto,@Request() req) {
    createTransactionDto.user_id= req.user.user_id;
    return this.transactionsService.createTransaction(createTransactionDto);
  }

  @Post(':id/status')
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