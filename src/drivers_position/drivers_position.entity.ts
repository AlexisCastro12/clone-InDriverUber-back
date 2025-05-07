import { Point } from 'geojson';
import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity({ name: 'drivers_position' })
export class DriversPosition {
  @PrimaryColumn()
  id_driver: number;

  @Index({ spatial: true })
  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  location: Point;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'id_driver' })
  user: User;
}
