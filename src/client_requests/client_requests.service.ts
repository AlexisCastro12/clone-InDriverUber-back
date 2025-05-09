import {
  Client,
  DistanceMatrixResponseData,
  TravelMode,
} from '@googlemaps/google-maps-services-js';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ClientRequestsService extends Client {
  private readonly API_KEY: string | undefined; //Declaramos la variable de entorno API_KEY
  constructor(private configService: ConfigService) {
    super();
    this.API_KEY = configService.get<string>('GOOGLE_SERVICES_API_KEY');
    // Verifica si la API_KEY está definida
    if (!this.API_KEY) {
      throw new Error(
        'Error al leer GOOGLE_SERVICES_API_KEY desde las variable de entorno',
      );
    }
  }

  async getTimeAndDistanceClientRequest(
    origin_lat: number,
    origin_lng: number,
    destination_lat: number,
    destination_lng: number,
  ): Promise<DistanceMatrixResponseData> {
    const googleResponse = await this.distancematrix({
      params: {
        mode: TravelMode.driving,
        key: this.API_KEY as string,
        origins: [
          {
            lat: origin_lat,
            lng: origin_lng,
          },
        ],
        destinations: [
          {
            lat: destination_lat,
            lng: destination_lng,
          },
        ],
      },
    });
    return googleResponse.data;
  }
}
