import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as argon2 from 'argon2';
import { Rol } from 'src/roles/rol.entity';
import { DriversPosition } from 'src/drivers_position/drivers_position.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  lastname: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  phone: string; //string porque no se hacen operaciones con el numero telefonico

  @Column({ nullable: true })
  image: string; //se trabaja con la url del servidor donde se almacenara la foto

  @Column()
  password: string;

  @Column({ nullable: true })
  notification_token: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @JoinTable({
    name: 'user_has_roles',
    joinColumn: {
      name: 'id_user',
    },
    inverseJoinColumn: {
      name: 'id_rol',
    },
  }) //Tabla padre o prioridad, Los usuarios siempre tendran roles, en logica, hasta que existe un usuario los roles son utiles
  @ManyToMany(() => Rol, (rol) => rol.users)
  roles: Rol[];

  @OneToMany(
    () => DriversPosition,
    (driversPosition) => driversPosition.id_driver,
  )
  driversPosition: DriversPosition;

  @BeforeInsert()
  async hashPassword() {
    try {
      this.password = await argon2.hash(this.password);
    } catch (err) {
      console.error('Error al encriptar la contraseña:', err);
    }
  }
}
