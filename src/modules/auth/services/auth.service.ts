import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../../users/services/users.service';
import { LoginDto } from '../dtos/login.dto'; // Using your current import path
import { RegisterDto } from '../dtos/register.dto'; // Using your current import path
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { User } from 'src/modules/users/entities/user.entity';
import { CreateWalletDto, WalletType } from 'src/modules/wallets/dtos/create-wallet.dto';
import { WalletsService } from 'src/modules/wallets/services/wallets.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly walletService: WalletsService
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    console.log('Login attempt with email:', email);
    const user = await this.usersService.findByEmail(email) as unknown as User | null;
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const tokens = this.generateTokens(user);
    
    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async register(registerDto: RegisterDto) {
    const { email } = registerDto;
    
    const existingUser = await this.usersService.findByEmail(email) as unknown as User | null;
    if (existingUser !== null) {
      throw new ConflictException('Email already exists');
    }

    const createUserDto = {
      ...registerDto,
      first_name: registerDto.first_name,
      last_name: registerDto.last_name,
      phone: registerDto.phone,
      date_of_birth: registerDto.date_of_birth,
      password: registerDto.password,

    };

    const user = await this.usersService.createUser(createUserDto);
    if (!user) {
      throw new ConflictException('Failed to create user');
    }
    const walletData : CreateWalletDto = {
            name: 'Main Wallet',
            wallet_type: WalletType.MAIN,
            description: "Main wallet for user",
            user_id: user.user_id,
            wallet_address: generateRandomBTCAddress(),
    }
    
    const wallet = await this.walletService.createDefaultWallet(walletData);
    if(!wallet) {
            throw new ConflictException('Failed to create wallet');
    }
    const tokens = this.generateTokens(user);
    
    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const decoded = this.jwtService.verify(refreshToken) as JwtPayload;
      const user = await this.usersService.findOne(String(decoded.sub)) as User | null;
      
      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }
      
      return this.generateTokens(user);
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async validateUser(payload: JwtPayload): Promise<User | null> {
    return this.usersService.findOne(String(payload.sub)) as Promise<User | null>;
  }

  private generateTokens(user: User) {
    const payload: JwtPayload = {
      sub: user.user_id,
      email: user.email,
      role: user.role,
    };
    
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: '7d', 
      }),
    };
  }

  private sanitizeUser(user: User) {
    const { password, ...result } = user;
    return result;
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