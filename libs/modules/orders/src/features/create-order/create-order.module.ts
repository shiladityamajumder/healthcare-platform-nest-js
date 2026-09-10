// Linked with: @nestjs/common, ./api/http/v1/create-order.controller, ./application/create-order.handler.
// Used by: the package code that imports this component.
// Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { CreateOrderController } from './api/http/v1/create-order.controller';
import { CreateOrderHandler } from './application/create-order.handler';

// Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [CreateOrderController],
  providers: [CreateOrderHandler],
})
export class CreateOrderModule {}
