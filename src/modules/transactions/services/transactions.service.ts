import { Injectable } from '@nestjs/common';
import { TransactionsRepository } from '../repositories/transactions.repository';
import { CreateTransactionDto } from '../dtos/create-transaction.dto';
import { Transaction, TransactionStatus } from '../entities/transaction.entity';

@Injectable()
export class TransactionsService {
  getTransactionsByUserId(userId: string,walletId: string): Promise<Transaction[]> {
    return this.transactionsRepository.find({
      where: { user_id: userId, wallet_id: walletId },
    });
  }
  constructor(
    private transactionsRepository: TransactionsRepository,
  ) {}

  async getTransactionById(id: string): Promise<Transaction|null> {
    return this.transactionsRepository.findOneBy({ transaction_id: id });
  }

  async createTransaction(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    const newTransaction = this.transactionsRepository.create({
      ...createTransactionDto,
      status: TransactionStatus.PENDING
    });
    return this.transactionsRepository.save(newTransaction);
  }
  async updateTransactionStatus(id: string, status: TransactionStatus): Promise<Transaction|null> {
  
    const transaction = await this.getTransactionById(id);
    if (!transaction) {
      throw new Error('Transaction not found');
    }
  
    const validStatuses = Object.values(TransactionStatus);
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid transaction status: ${status}`);
    }
  
    await this.transactionsRepository.update(id, { status }); 
    return this.getTransactionById(id);
  }
  
}