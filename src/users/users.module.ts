import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { JwtStrategy } from 'src/auth/jwt/jwt.strategy';
import { Rol } from 'src/roles/rol.entity';
import { DriversPosition } from 'src/drivers_position/drivers_position.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Rol, DriversPosition])],
  providers: [UsersService, JwtStrategy],
  controllers: [UsersController],
})
export class UsersModule {}
