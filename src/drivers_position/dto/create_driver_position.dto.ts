import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class createDriverPositionDto {
  @IsNotEmpty()
  @IsNumber({ allowNaN: false, allowInfinity: false })
  id_driver: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  lat: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  lng: number;
}
