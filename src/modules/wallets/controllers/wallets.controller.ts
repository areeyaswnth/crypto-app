import {
    Controller,
    Post,
    Body,
    Get,
    UseGuards,
    Request,
    UsePipes,
    ValidationPipe,
    Param,
    HttpException,
    HttpStatus
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { WalletsService } from '../services/wallets.service';
import { CreateWalletDto, WalletType } from '../dtos/create-wallet.dto';
@Controller('wallets')
export class WalletsController {
    constructor(private readonly walletsService:WalletsService) {}
    
    @Post('create')
    @UseGuards(JwtAuthGuard)
    async createWallet(@Request() req) {
        if (!req.user) {
            throw new HttpException('User not authenticated', HttpStatus.UNAUTHORIZED);
          }
        const userId = req.user.user_id;
        const createWalletDto:CreateWalletDto= {
            name: req.body.name,
            description: req.body.description,
            user_id: userId,
            wallet_type: req.body.wallet_type as WalletType,
            wallet_address: generateRandomBTCAddress(), // Replace with actual wallet address generation logic
        };
        const wallet = await this.walletsService.createWalletByType(createWalletDto);
        if (!wallet) {
            throw new HttpException('Failed to create wallet', HttpStatus.INTERNAL_SERVER_ERROR);
        }
        
        return { wallet:wallet, userId: req.user.user_id };
    }
    
    @Get(':userId')
    @UseGuards(JwtAuthGuard)
    async getWallets(@Param('userId') userId: string) {
        console.log('userId:', userId);
        if (!userId) {
            throw new HttpException('User ID not provided', HttpStatus.BAD_REQUEST);
        }
        const wallets = await this.walletsService.getWalletsByUserId(userId);

        if (!wallets) {
            throw new HttpException('No wallets found', HttpStatus.NOT_FOUND);
        }
        return wallets;
    }
    
    @Get('wallet/:walletId')
    @UseGuards(JwtAuthGuard)
    async getWallet(@Param('walletId') walletId: string,@Request() req) {
        const user_id = req.user.user_id;
        if (!user_id) {
            throw new HttpException('User ID not provided', HttpStatus.BAD_REQUEST);
        }
        if (!walletId) {
            throw new HttpException('Wallet ID not provided', HttpStatus.BAD_REQUEST);
        }
        const wallet = await this.walletsService.getWalletByWalletId(walletId,user_id);
        if (!wallet) {
            throw new HttpException('Wallet not found', HttpStatus.NOT_FOUND);
        }
        return wallet;
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