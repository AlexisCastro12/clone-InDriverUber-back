import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import cloud_storage from '../utils/cloud_storage';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  //Funcion que recibe un dato de tipo CreateUserDto
  create(user: CreateUserDto) {
    const newUser = this.usersRepository.create(user); //Crea un usuario con la estructura correspondiente a la tabla en bbdd
    return this.usersRepository.save(newUser); //Almacena en la base de dato del nuevo usuario
  }

  findAll() {
    return this.usersRepository.find({ relations: ['roles'] });
  }

  async update(id: number, user: UpdateUserDto) {
    const userfound = await this.usersRepository.findOneBy({ id: id });

    if (!userfound) {
      throw new HttpException('Usuario no existe', HttpStatus.NOT_FOUND);
    }

    const updatedUser = Object.assign(userfound, user);
    return this.usersRepository.save(updatedUser);
  }

  async updateWithImage(
    image: Express.Multer.File,
    id: number,
    user: UpdateUserDto,
  ) {
    const url = await cloud_storage(image, image.originalname);
    //console.log('URL EN CLOUD STORAGE: ' + url);

    if (!url) {
      throw new HttpException(
        'La imagen no se pudo guardar',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    const userfound = await this.usersRepository.findOneBy({ id: id });

    if (!userfound) {
      throw new HttpException('Usuario no existe', HttpStatus.NOT_FOUND);
    }

    user.image = url;
    const updatedUser = Object.assign(userfound, user);
    return this.usersRepository.save(updatedUser);
  }
}
