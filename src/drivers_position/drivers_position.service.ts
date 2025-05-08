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
      //Se requiere crear esta variable para evitar sql injection, se inserta todo el texto de golpe en el query creado
      const point = `SRID=4326;POINT(${driverPosition.lng} ${driverPosition.lat})`;
      //Se accede a la tabla mediante el schema udemy_delivery.drivers_position, esto puede cambiar en produccion
      const data: any[] = await this.driversPositionRepository.query(
        `
        SELECT
          *
        FROM
          udemy_delivery.drivers_position
        WHERE
          id_driver = $1
        `,
        [driverPosition.id_driver],
      );
      //Se tipó data con any[] para que al aplicarle .length no marque error de sintaxis
      if (data.length <= 0) {
        await this.driversPositionRepository.query(
          `
            INSERT INTO
              udemy_delivery.drivers_position(id_driver, location)
            VALUES(
            $1,
            ST_GeogFromText($2)
            )
            `,
          [driverPosition.id_driver, point],
        );
      } else {
        await this.driversPositionRepository.query(
          `
          UPDATE
            udemy_delivery.drivers_position
          SET
            location = ST_GeogFromText($1)
          WHERE
          id_driver = $2
          `,
          [point, driverPosition.id_driver],
        );
      }
      return true;
    } catch (error) {
      console.log('Error al registrar la ubicacion del conductor:\n', error);
      return false;
    }
  }

  async getNearbyDrivers(client_lat: number, client_lng: number) {
    //Se requiere crear esta variable para evitar sql injection, se inserta todo el texto de golpe en el query creado
    const point = `SRID=4326;POINT(${client_lng} ${client_lat})`;
    const driversPosition = await this.driversPositionRepository.query(
      `
      SELECT
        id_driver,
        ST_Y(location::geometry) AS locationlat,
        ST_X(location::geometry) AS locationlng,
        ST_Distance(location::geography, ST_GeogFromText($1)) AS distance
      FROM
        udemy_delivery.drivers_position
      WHERE ST_DWithin(location::geography, ST_GeogFromText($1) , 500)
      ORDER BY
        distance ASC;
      `,
      [point],
    );
    return driversPosition;
  }

  async delete(id_driver: number) {
    return this.driversPositionRepository.delete(id_driver);
  }
}
