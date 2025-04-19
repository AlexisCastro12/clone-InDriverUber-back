import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register') //Ruta: https://localhost:3000/auth/register -> POST
  register(@Body() user: RegisterAuthDto) {
    return this.authService.register(user);
  }

  @Post('login') //Ruta: https://localhost:3000/auth/login -> POST
  login(@Body() user: LoginAuthDto) {
    return this.authService.login(user);
  }
}
