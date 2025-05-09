import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'time_and_distance_values' })
export class TimeAndDistanceValues {
  @PrimaryGeneratedColumn()
  id: number;

  //Columna que permite una entrada numerica de longitud 4 -> 2 enteros y 2 decimales (scale:2)
  @Column('decimal', { precision: 4, scale: 2 })
  km_value: number;

  @Column('decimal', { precision: 4, scale: 2 })
  min_value: number;
}
