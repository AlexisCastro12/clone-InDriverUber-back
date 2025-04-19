import { SetMetadata } from '@nestjs/common';
import { JwtRole } from './jwt-role';

//Creamos un decorador que servira para filtrar el acceso por roles a las rutas
export const HasRoles = (...roles: JwtRole[]) => SetMetadata('roles', roles);
