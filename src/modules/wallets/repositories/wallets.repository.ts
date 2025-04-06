import { 
    Injectable, 
    NotFoundException, 
    InternalServerErrorException 
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { 
    Repository, 
    EntityManager, 
    FindManyOptions, 
    FindOneOptions, 
    DeepPartial, 
    FindOptionsWhere
  } from 'typeorm';
  import { Wallet } from '../entities/wallet.entity';
  import { CreateWalletDto } from '../dtos/create-wallet.dto';
  import { UpdateWalletDto } from '../dtos/update-wallet.dto';
  
  @Injectable()
  export class WalletsRepository {
    async save(wallet: Promise<Wallet>): Promise<Wallet>{
      return wallet;
    }
    constructor(
      @InjectRepository(Wallet)
      private readonly walletRepository: Repository<Wallet>,
      private readonly entityManager: EntityManager
    ) {}
  
    // Create a new wallet
    async create(createWalletDto: CreateWalletDto, userId?: string): Promise<Wallet> {
      try {
        const wallet = this.walletRepository.create({
          ...createWalletDto,
          user_id: userId || createWalletDto.userId, // Ensure user_id exists in Wallet entity
          balance: createWalletDto.initialBalance || 0,
          created_at: new Date(),
          updated_at: new Date(),
          crypto_type: createWalletDto.crypto_type || 'BTC', // Default to BTC if not provided
          wallet_address: createWalletDto.wallet_address|| generateRandomBTCAddress(),
        });
  
        const savedWallet = await this.walletRepository.save(wallet);
        return Array.isArray(savedWallet) ? savedWallet[0] : savedWallet;
      } catch (error) {
        throw new InternalServerErrorException('Failed to create wallet', error.message);
      }
    }

  
    // Find wallet by ID
    async findById(id: string, relations: string[] = []): Promise<Wallet> {
      try {
        const wallet = await this.walletRepository.findOne({
          where: { id } as any,
          relations,
        });
  
        if (!wallet) {
          throw new NotFoundException(`Wallet with ID ${id} not found`);
        }
  
        return wallet;
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw error;
        }
        throw new InternalServerErrorException('Error finding wallet', error.message);
      }
    }
  
    // Find wallets with pagination and filtering
    async findAll(options: {
      page?: number;
      limit?: number;
      userId?: string;
      type?: string;
    } = {}): Promise<{ data: Wallet[]; total: number; page: number; limit: number }> {
      try {
        const { page = 1, limit = 10, userId, type } = options;
  
        const queryOptions: FindManyOptions<Wallet> = {
          where: {
            ...(userId && { userId: userId }),
            ...(type && { type: type }),
          } as FindOptionsWhere<Wallet>,
          skip: (page - 1) * limit,
          take: limit,
          order: { created_at: 'DESC' },
        };
  
        const [data, total] = await this.walletRepository.findAndCount(queryOptions);
  
        return {
          data,
          total,
          page,
          limit,
        };
      } catch (error) {
        throw new InternalServerErrorException('Error fetching wallets', error.message);
      }
    }
  
    // Update wallet
    async update(id: string, updateWalletDto: UpdateWalletDto): Promise<Wallet> {
      try {
        // Find existing wallet
        const wallet = await this.findById(id);
  
        // Update wallet properties
        const updatedWallet = this.walletRepository.merge(wallet, {
          ...updateWalletDto,
          updated_at: new Date()
        });
  
        return await this.walletRepository.save(updatedWallet);
      } catch (error) {
        throw new InternalServerErrorException('Failed to update wallet', error.message);
      }
    }
  
    // Soft delete wallet
    async softDelete(id: string): Promise<void> {
      try {
        const result = await this.walletRepository.softDelete(id);
  
        if (result.affected === 0) {
          throw new NotFoundException(`Wallet with ID ${id} not found`);
        }
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw error;
        }
        throw new InternalServerErrorException('Failed to delete wallet', error.message);
      }
    }
  
    // Update wallet balance
    async updateBalance(
      id: string, 
      amount: number, 
      transaction: EntityManager = this.entityManager
    ): Promise<Wallet> {
      try {
        return await transaction.transaction(async transactionalEntityManager => {
          // Find wallet with a lock to prevent race conditions
          const wallet = await transactionalEntityManager.findOne(Wallet, {
            where: { id } as any,
            lock: { mode: 'pessimistic_write' }
          });
  
          if (!wallet) {
            throw new NotFoundException(`Wallet with ID ${id} not found`);
          }
  
          // Update balance
          wallet.balance += amount;
          wallet.updated_at = new Date();
  
          return await transactionalEntityManager.save(wallet);
        });
      } catch (error) {
        throw new InternalServerErrorException('Failed to update wallet balance', error.message);
      }
    }
  
    // Check if wallet belongs to user
    async validateWalletOwnership(walletId: string, userId: string): Promise<boolean> {
      try {
        const wallet = await this.walletRepository.findOne({
          where: { id: walletId, userId: userId } as any
        });
  
        return !!wallet;
      } catch (error) {
        throw new InternalServerErrorException('Error validating wallet ownership', error.message);
      }
    }
  
    // Batch create wallets
    async createMany(
      createWalletDtos: CreateWalletDto[], 
      userId?: string
    ): Promise<Wallet[]> {
      try {
        const walletsToCreate = createWalletDtos.map(dto => 
          this.walletRepository.create({
            ...dto,
            user_id: userId || dto.userId,
            balance: dto.initialBalance || 0,
            created_at: new Date(),
            updated_at: new Date()
          })
        );
  
        return await this.walletRepository.save(walletsToCreate);
      } catch (error) {
        throw new InternalServerErrorException('Failed to create multiple wallets', error.message);
      }
    }
  }
  function generateRandomBTCAddress(): string {
    const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'; // Base58
    let address = '1'; // Bitcoin address typically starts with '1' or '3'
    for (let i = 0; i < 33; i++) {
      address += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return address;
  }
  