// * Linked with: @nestjs/common, ./delivery-status.controller, ./delivery-status.handler.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { DeliveryStatusController } from './delivery-status.controller';
import { DeliveryStatusHandler } from './delivery-status.handler';

// * Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [DeliveryStatusController],
  providers: [DeliveryStatusHandler],
})
export class DeliveryStatusModule {}
