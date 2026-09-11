// * Linked with: @nestjs/common, ./api/http/v1/list-orders.controller, ./application/list-orders.handler.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { ListOrdersController } from './api/http/v1/list-orders.controller';
import { ListOrdersHandler } from './application/list-orders.handler';

// * Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [ListOrdersController],
  providers: [ListOrdersHandler],
})
export class ListOrdersModule {}
