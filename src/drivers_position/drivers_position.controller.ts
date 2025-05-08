import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { DriversPositionService } from './drivers_position.service';
import { createDriverPositionDto } from './dto/create_driver_position.dto';

@Controller('drivers-position')
export class DriversPositionController {
  constructor(private driversPositionService: DriversPositionService) {}

  @Post()
  create(@Body() driverPosition: createDriverPositionDto) {
    return this.driversPositionService.create(driverPosition);
  }

  @Get(':client_lat/:client_lng')
  getNearbyDrivers(
    @Param('client_lat') client_lat: number,
    @Param('client_lng') client_lng: number,
  ) {
    return this.driversPositionService.getNearbyDrivers(client_lat, client_lng);
  }
}
