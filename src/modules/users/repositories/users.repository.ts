import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from 'src/modules/auth/dtos/register.dto';

@Injectable()
export class UsersRepository {
  create(registerDto: RegisterDto) {
    return this.usersRepository.create(registerDto);
  }
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { password, ...userData } = createUserDto;
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.usersRepository.create({
      ...userData,
      password: hashedPassword,
      is_verified: false,
      role: 'user'
    });

    return this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ 
      where: { email },
      select: ['user_id', 'email', 'password', 'is_verified']
    });
  }

  async findById(user_id: string): Promise<User | null> {
    return this.usersRepository.findOne({ 
      where: { user_id },
      relations: ['wallets', 'trade_orders']
    });
  }
}