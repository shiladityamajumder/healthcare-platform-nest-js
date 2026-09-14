// * Linked with: @nestjs/common, ./list-orders.controller, ./list-orders.handler.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { ListOrdersController } from './list-orders.controller';
import { ListOrdersHandler } from './list-orders.handler';

// * Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [ListOrdersController],
  providers: [ListOrdersHandler],
})
export class ListOrdersModule {}
