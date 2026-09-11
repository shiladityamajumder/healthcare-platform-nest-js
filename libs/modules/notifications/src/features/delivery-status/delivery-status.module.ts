// * Linked with: @nestjs/common, ./api/http/v1/delivery-status.controller, ./application/delivery-status.handler.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { DeliveryStatusController } from './api/http/v1/delivery-status.controller';
import { DeliveryStatusHandler } from './application/delivery-status.handler';

// * Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [DeliveryStatusController],
  providers: [DeliveryStatusHandler],
})
export class DeliveryStatusModule {}
