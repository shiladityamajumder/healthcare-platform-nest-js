// * Linked with: @nestjs/common, ./availability.controller, ./availability.handler.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { AvailabilityController } from './availability.controller';
import { AvailabilityHandler } from './availability.handler';

// * Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [AvailabilityController],
  providers: [AvailabilityHandler],
})
export class AvailabilityModule {}
