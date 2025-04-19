import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository, In } from 'typeorm';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { Rol } from 'src/roles/rol.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Rol) private rolesRepository: Repository<Rol>,
    private jwtService: JwtService,
  ) {}

  async register(user: RegisterAuthDto) {
    //Desestructuramos la info que usaremos del dto
    const { email, phone } = user;
    const emailExist = await this.usersRepository.findOneBy({
      email: email,
    });
    if (emailExist) {
      //Se puede sustituir el HttpStatus.CONFLICT por el la respuesta HTTP 409 (Errores que el usuario puede solucionar)
      throw new HttpException(
        'el Email ya esta registrado',
        HttpStatus.CONFLICT,
      );
    }

    const phoneExist = await this.usersRepository.findOneBy({
      phone: phone,
    });
    if (phoneExist) {
      throw new HttpException(
        'el telefono ya esta registrado',
        HttpStatus.CONFLICT,
      );
    }

    const newUser = this.usersRepository.create(user);
    let rolesIds: string[] = [];
    //Si no se reciben roles entonces se asigna por defecto cliente
    if (!user.rolesIds || user.rolesIds.length === 0) {
      rolesIds.push('CLIENT');
    } else {
      rolesIds = user.rolesIds; //Roles recibidos en la solicitud HTTP (Dto)
    }
    const roles = await this.rolesRepository.findBy({ id: In(rolesIds) }); //Buscamos los roles en la tabla roles con todas sus caracteristicas (el objeto completo) porque solo habiamos recibido el idRol []
    newUser.roles = roles; //Asignamos los roles al nuevo usuario (TypeORM crea automaticamente el enlace en la tabla pivote)
    const userSaved = await this.usersRepository.save(newUser); //Guardamos el usuario con sus roles, y se crea el enlace automatico con los roles por los pasos anteriores
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userSavedFiltered } = userSaved; //Filtramos la contraseña y solo enviamos los datos que necesitamos del usuario
    const rolesString = userSavedFiltered.roles.map((rol) => rol.id); //extraemos solo los ids de los roles de cada usuario (ADMIN,CLIENT,etc)
    //Firmamos el token con el id, el nombre y los roles que tendra el usuario
    const payload = {
      id: userSavedFiltered.id,
      name: userSavedFiltered.name,
      roles: rolesString,
    }; //Carga de datos que se iran firmados con el token
    const token = this.jwtService.sign(payload);
    const data = {
      user: userSavedFiltered,
      token: 'Bearer ' + token,
    };
    return data;
  }

  async login(loginData: LoginAuthDto) {
    const email = loginData.email;
    const pass = loginData.password;
    const userFound = await this.usersRepository.findOne({
      where: { email: email },
      relations: ['roles'],
    });
    if (!userFound) {
      //El NOT_FOUND es equivalente a la respuesta 404, en este caso cambio del 409 porque ahora se hizo busqueda de informacion pero no se encontro en la bbdd
      throw new HttpException('El email no existe', HttpStatus.NOT_FOUND);
    }
    const isPasswordValid = await argon2.verify(userFound.password, pass);
    //Se compara el hash de la bbdd (userFound.password) con la info que se recibio en la peticion por el cliente (el dto -> desestructurado)
    if (!isPasswordValid) {
      throw new HttpException(
        //El FORBIDDEN es equivalente a la respuesta 403, indica que el acceso es denegado a un recurso
        'La contraseña es incorrecta',
        HttpStatus.FORBIDDEN,
      );
    }

    const rolesIds = userFound.roles.map((rol) => rol.id); //["CLIENTE","ADMIN", etc] devuelve solo los roles que tiene el usuario encontrado
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userFiltered } = userFound; //Filtramos la contraseña y solo enviamos los datos que necesitamos del usuario
    const payload = {
      id: userFound.id,
      name: userFound.name,
      roles: rolesIds,
    }; //Carga de datos que se iran firmados con el token
    const token = this.jwtService.sign(payload);
    const data = {
      user: userFiltered,
      token: 'Bearer ' + token,
    };
    //Al completar todas las validaciones entonces ya permite retornar el usuario desde la bbdd con su respectivo token de sesion para indicar que se ha iniciado la sesion correctamente
    return data;
  }
}
