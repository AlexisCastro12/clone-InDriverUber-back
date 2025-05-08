import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DriversPosition } from './drivers_position.entity';
import { Repository } from 'typeorm';
import { createDriverPositionDto } from './dto/create_driver_position.dto';

@Injectable()
export class DriversPositionService {
  constructor(
    @InjectRepository(DriversPosition)
    private driversPositionRepository: Repository<DriversPosition>,
  ) {}

  async create(driverPosition: createDriverPositionDto) {
    try {
      //Se accede a la tabla mediante el schema udemy_delivery.drivers_position, esto puede cambiar en produccion
      await this.driversPositionRepository.query(`
        INSERT INTO
          udemy_delivery.drivers_position(id_driver, location)
        VALUES(
        ${driverPosition.id_driver},
        ST_GeogFromText('SRID=4326;POINT(${driverPosition.lng} ${driverPosition.lat})')
        )
        `);
      return true;
    } catch (error) {
      console.log('Error al registrar la ubicacion del conductor:\n', error);
      return false;
    }
  }
}
