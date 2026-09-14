// * Linked with: @nestjs/common, ./cancel-order.controller, ./cancel-order.handler.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { CancelOrderController } from './cancel-order.controller';
import { CancelOrderHandler } from './cancel-order.handler';

// * Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [CancelOrderController],
  providers: [CancelOrderHandler],
})
export class CancelOrderModule {}
