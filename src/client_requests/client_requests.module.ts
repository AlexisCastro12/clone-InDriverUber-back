import { Module } from '@nestjs/common';
import { ClientRequestsService } from './client_requests.service';
import { ClientRequestsController } from './client_requests.controller';
import { TimeAndDistanceValuesModule } from 'src/time_and_distance_values/time_and_distance_values.module';
import { JwtStrategy } from 'src/auth/jwt/jwt.strategy';

@Module({
  imports: [TimeAndDistanceValuesModule], //Importando el modulo para acceder al servicio customizado que creamos
  providers: [ClientRequestsService, JwtStrategy],
  controllers: [ClientRequestsController],
})
export class ClientRequestsModule {}
