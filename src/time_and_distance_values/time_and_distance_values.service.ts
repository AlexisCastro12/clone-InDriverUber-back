import { InjectRepository } from '@nestjs/typeorm';
import { TimeAndDistanceValues } from './time_and_distance_values.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TimeAndDistanceValuesService {
  constructor(
    @InjectRepository(TimeAndDistanceValues)
    private timeAndDistanceValuesRepository: Repository<TimeAndDistanceValues>,
  ) {}

  find() {
    return this.timeAndDistanceValuesRepository.findOne({ where: { id: 1 } });
  }
}
