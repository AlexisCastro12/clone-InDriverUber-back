import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DriversPositionModule } from './drivers_position/drivers_position.module';
import { ClientRequestsModule } from './client_requests/client_requests.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Hace que esté disponible en toda la app y se inyecte en clases mediante configservice
      envFilePath: '.env', // nombre/ruta de archivo de variables de entorno
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: parseInt(
          configService.get<string>('DATABASE_PORT') || '5432',
          10,
        ),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        schema: configService.get<string>('DATABASE_SCHEMA'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'], //Equivalente a agregar [user, entity2, entity3, etc.] manualmente todas, una por una
        synchronize: true, // ¡No usar en producción!
      }),
    }),
    UsersModule,
    AuthModule,
    RolesModule,
    DriversPositionModule,
    ClientRequestsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
