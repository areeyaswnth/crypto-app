import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { UsersRepository } from '../repositories/users.repository';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from 'src/modules/auth/dtos/register.dto';

@Injectable()
export class UsersService {
  create(registerDto: RegisterDto) {
      return this.usersRepository.create(registerDto);
  }
  findByEmail(email: string) {
    return this.usersRepository.findByEmail(email);
  }
  async findOne(id: string) {
    const user = await this.usersRepository.findById(id);
    if (!user) {
        throw new NotFoundException('User not found');
    }
    return user;
  }

  constructor(
    private readonly usersRepository: UsersRepository
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {

    const existingUser = await this.usersRepository.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Create new user
    return this.usersRepository.createUser(createUserDto);
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersRepository.findByEmail(email);
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async getUserProfile(user_id: string): Promise<User> {
    const user = await this.usersRepository.findById(user_id);
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}