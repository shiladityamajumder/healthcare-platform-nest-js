import { Module } from '@nestjs/common';
import { ReleaseReservationController } from './api/http/v1/release-reservation.controller';
import { ReleaseReservationHandler } from './application/release-reservation.handler';

@Module({
  controllers: [ReleaseReservationController],
  providers: [ReleaseReservationHandler],
})
export class ReleaseReservationModule {}
