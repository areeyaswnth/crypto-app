import {
    Controller,
    Post,
    Body,
    Get,
    UseGuards,
    Request,
    UsePipes,
    ValidationPipe,
    Param
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
@Controller('wallets')
export class WalletsController {
}

// export class UsersController {
//     constructor(private readonly usersService: UsersService) { }

//     @Post('register')
//     @UsePipes(new ValidationPipe({ transform: true }))
//     async createUser(@Body() createUserDto: CreateUserDto) {
//         return this.usersService.createUser(createUserDto);
//     }

//     @Get('profile')
//     @UseGuards(JwtAuthGuard)
//     async getUserProfile(@Request() req) {
//         return this.usersService.getUserProfile(req.user.user_id);
//     }

//     @Get(':id')
//     findOne(@Param('id') id: string) {
//         return this.usersService.findOne(id);
//     }
// }