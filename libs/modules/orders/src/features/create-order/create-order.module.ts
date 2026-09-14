// * Linked with: @nestjs/common, ./create-order.controller, ./create-order.handler.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { CreateOrderController } from './create-order.controller';
import { CreateOrderHandler } from './create-order.handler';

// * Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [CreateOrderController],
  providers: [CreateOrderHandler],
})
export class CreateOrderModule {}
