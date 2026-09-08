import { Module } from '@nestjs/common';
import { AvailabilityController } from './api/http/v1/availability.controller';
import { AvailabilityHandler } from './application/availability.handler';

@Module({
  controllers: [AvailabilityController],
  providers: [AvailabilityHandler],
})
export class AvailabilityModule {}
