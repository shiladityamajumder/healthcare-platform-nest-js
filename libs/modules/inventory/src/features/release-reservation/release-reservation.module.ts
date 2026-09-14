// * Linked with: @nestjs/common, ./release-reservation.controller, ./release-reservation.handler.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { ReleaseReservationController } from './release-reservation.controller';
import { ReleaseReservationHandler } from './release-reservation.handler';

// * Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [ReleaseReservationController],
  providers: [ReleaseReservationHandler],
})
export class ReleaseReservationModule {}
