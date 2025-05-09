import { Client, TravelMode } from '@googlemaps/google-maps-services-js';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TimeAndDistanceValuesService } from 'src/time_and_distance_values/time_and_distance_values.service';

@Injectable()
export class ClientRequestsService extends Client {
  private readonly API_KEY: string | undefined; //Declaramos la variable de entorno API_KEY
  constructor(
    private configService: ConfigService,
    private timeAndDistanceValues: TimeAndDistanceValuesService,
  ) {
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
  ) {
    const values = await this.timeAndDistanceValues.find();
    console.log('-------VALORES-------\n', values);
    const km_value = values!.km_value;
    const min_value = values!.min_value;
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
    const recommendedValue =
      km_value *
        (googleResponse.data.rows[0].elements[0].distance.value / 1000) +
      min_value * (googleResponse.data.rows[0].elements[0].duration.value / 60);

    return {
      recommended_value: recommendedValue,
      destination_addresses: googleResponse.data.destination_addresses[0],
      origin_addresses: googleResponse.data.origin_addresses[0],
      distance: {
        text: googleResponse.data.rows[0].elements[0].distance.text,
        value: googleResponse.data.rows[0].elements[0].distance.value / 1000,
      },
      duration: {
        text: googleResponse.data.rows[0].elements[0].duration.text,
        value: googleResponse.data.rows[0].elements[0].duration.value / 60,
      },
    };
  }
}
