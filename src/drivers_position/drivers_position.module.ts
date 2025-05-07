import { Module } from '@nestjs/common';
import { DriversPositionController } from './drivers_position.controller';
import { DriversPositionService } from './drivers_position.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriversPosition } from './drivers_position.entity';
import { User } from 'src/users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DriversPosition, User])],
  controllers: [DriversPositionController],
  providers: [DriversPositionService],
})
export class DriversPositionModule {}
