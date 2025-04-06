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

    async findByUserId(user_id: string): Promise<Wallet[]> {
      return this.walletRepository.find({
        where: { user_id: user_id } as FindOptionsWhere<Wallet>,
        order: { created_at: 'DESC' },
        relations: ['user'],
      });
    }
    async findByType(user_id: string, wallet_type: string): Promise<Wallet | null> {
      const wallet = await this.walletRepository.findOne({
        where: { user_id: user_id, wallet_type:wallet_type } as FindOptionsWhere<Wallet>,
        order: { created_at: 'DESC' },
        relations: ['user'],
      });
    
      return wallet; 
    }
    
    async save(wallet: Promise<Wallet>): Promise<Wallet>{
      return wallet;
    }
    constructor(
      @InjectRepository(Wallet)
      private readonly walletRepository: Repository<Wallet>,
      private readonly entityManager: EntityManager
    ) {}
  
    async create(createWalletDto: CreateWalletDto, user_id?: string): Promise<Wallet> {
      try {
        const wallet = this.walletRepository.create({
          ...createWalletDto,
          user_id: user_id || createWalletDto.user_id,
          created_at: new Date(),
          updated_at: new Date(),
          wallet_address: createWalletDto.wallet_address || generateRandomBTCAddress(),
        } as DeepPartial<Wallet>);
  
        const savedWallet = await this.walletRepository.save(wallet);
        return Array.isArray(savedWallet) ? savedWallet[0] : savedWallet;
      } catch (error) {
        throw new InternalServerErrorException('Failed to create wallet', error.message);
      }
    }
    async findById(id: string,user_id:string): Promise<Wallet|null> {

      try {
        const wallet = await this.walletRepository.findOne({
          where: [
            { wallet_id: id, user_id: user_id },
          ]
        });
  
      
  
        return wallet;
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw error;
        }
        throw new InternalServerErrorException('Error finding wallet', error.message);
      }
    }
  
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
    
   
  }
  function generateRandomBTCAddress(): string {
    const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'; 
    let address = '1'; 
    for (let i = 0; i < 33; i++) {
      address += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return address;
  }
  