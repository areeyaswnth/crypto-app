import { Injectable } from '@nestjs/common';
import { TransactionsRepository } from '../repositories/transactions.repository';
import { CreateTransactionDto } from '../dtos/create-transaction.dto';
import { Transaction, TransactionStatus } from '../entities/transaction.entity';

@Injectable()
export class TransactionsService {
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

  async updateTransactionStatus(id: string, status: TransactionStatus): Promise<Transaction> {
    const transaction = await this.getTransactionById(id);
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    transaction.status = status;
    return this.transactionsRepository.save(transaction);
  }
}