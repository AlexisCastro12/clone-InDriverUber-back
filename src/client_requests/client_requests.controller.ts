import {
  Controller,
  Get,
  Param,
  // UseGuards,
} from '@nestjs/common';
import { ClientRequestsService } from './client_requests.service';
// import { HasRoles } from 'src/auth/jwt/has-roles';
// import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
// import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles.guard';
// import { JwtRole } from 'src/auth/jwt/jwt-role';

@Controller('client-requests')
export class ClientRequestsController {
  constructor(private clientRequestsService: ClientRequestsService) {}

  // @HasRoles(JwtRole.CLIENT)
  // @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Get(':origin_lat/:origin_lng/:destination_lat/:destination_lng')
  getTimeAndDistanceClientRequest(
    @Param('origin_lat') origin_lat: number,
    @Param('origin_lng') origin_lng: number,
    @Param('destination_lat') destination_lat: number,
    @Param('destination_lng') destination_lng: number,
  ) {
    return this.clientRequestsService.getTimeAndDistanceClientRequest(
      origin_lat,
      origin_lng,
      destination_lat,
      destination_lng,
    );
  }
}
