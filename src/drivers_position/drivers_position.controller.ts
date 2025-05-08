import { Body, Controller, Post } from '@nestjs/common';
import { DriversPositionService } from './drivers_position.service';
import { createDriverPositionDto } from './dto/create_driver_position.dto';

@Controller('drivers-position')
export class DriversPositionController {
  constructor(private driversPositionService: DriversPositionService) {}

  @Post()
  create(@Body() driverPosition: createDriverPositionDto) {
    return this.driversPositionService.create(driverPosition);
  }
}
