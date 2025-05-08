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
      const data: any[] = await this.driversPositionRepository.query(`
        SELECT
          *
        FROM
          udemy_delivery.drivers_position
        WHERE
          id_driver = ${driverPosition.id_driver}
        `);
      //Se tipó data con any[] para que al aplicarle .length no marque error de sintaxis
      if (data.length <= 0) {
        await this.driversPositionRepository.query(`
            INSERT INTO
              udemy_delivery.drivers_position(id_driver, location)
            VALUES(
            ${driverPosition.id_driver},
            ST_GeogFromText('SRID=4326;POINT(${driverPosition.lng} ${driverPosition.lat})')
            )
            `);
      } else {
        await this.driversPositionRepository.query(`
          UPDATE
            udemy_delivery.drivers_position
          SET
            location = ST_GeogFromText('SRID=4326;POINT(${driverPosition.lng} ${driverPosition.lat})')
          WHERE
          id_driver = ${driverPosition.id_driver}
          `);
      }
      return true;
    } catch (error) {
      console.log('Error al registrar la ubicacion del conductor:\n', error);
      return false;
    }
  }

  async getNearbyDrivers(client_lat: number, client_lng: number) {
    const driversPosition = await this.driversPositionRepository.query(`
      SELECT
        id_driver,
        ST_Y(location::geometry) AS locationlat,
        ST_X(location::geometry) AS locationlng,
        ST_Distance(location::geography, ST_GeogFromText('SRID=4326; POINT(${client_lng} ${client_lat})')) AS distance
      FROM
        udemy_delivery.drivers_position
      WHERE ST_DWithin(location::geography, ST_GeogFromText('SRID=4326; POINT(${client_lng} ${client_lat})') , 500)
      ORDER BY
        distance ASC;
      `);
    return driversPosition;
  }

  async delete(id_driver: number) {
    return this.driversPositionRepository.delete(id_driver);
  }
}
