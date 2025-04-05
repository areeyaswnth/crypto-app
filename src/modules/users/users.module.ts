import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { UsersRepository } from './repositories/users.repository';
import { User } from './entities/user.entity';
import { AuthModule } from '../auth/auth.module'; // Import the AuthModule

@Module({
  imports: [
    // Import TypeORM entities for this module
    TypeOrmModule.forFeature([User]),
    
    // Import AuthModule with forwardRef to avoid circular dependencies
    forwardRef(() => AuthModule)
  ],
  controllers: [UsersController],
  providers: [
    UsersService, 
    UsersRepository
  ],
  exports: [
    UsersService, 
    UsersRepository,
    TypeOrmModule // Export TypeORM module for use in other modules
  ]
})
export class UsersModule {}