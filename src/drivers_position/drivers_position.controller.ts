import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseFloatPipe,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
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
    @Param('client_lat', ParseFloatPipe) client_lat: number,
    @Param('client_lng', ParseFloatPipe) client_lng: number,
  ) {
    return this.driversPositionService.getNearbyDrivers(client_lat, client_lng);
  }

  @Delete(':id_driver')
  delete(@Param('id_driver', ParseIntPipe) id_driver: number) {
    return this.driversPositionService.delete(id_driver);
  }
}
