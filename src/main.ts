import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      //--> NOTA: Si no se tienen validaciones en todos los dtos, se eliminaran campos antes de enviarlos o procesarlos en una solicitud
      whitelist: true, // Elimina propiedades no definidas en el DTO
      forbidNonWhitelisted: true, // Lanza error si se envían propiedades no permitidas
      transform: true, // Transforma el payload a la clase DTO automáticamente
    }),
  );

  const configService = app.get(ConfigService);
  const port = configService.get<number>('APP_PORT') || 3000;
  const host = configService.get<string>('APP_HOST') || 'localhost';

  await app.listen(port, host);
}
bootstrap();
