// Linked with: @nestjs/common, ./api/http/v1/get-order.controller, ./application/get-order.handler.
// Used by: the package code that imports this component.
// Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { GetOrderController } from './api/http/v1/get-order.controller';
import { GetOrderHandler } from './application/get-order.handler';

// Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [GetOrderController],
  providers: [GetOrderHandler],
})
export class GetOrderModule {}
