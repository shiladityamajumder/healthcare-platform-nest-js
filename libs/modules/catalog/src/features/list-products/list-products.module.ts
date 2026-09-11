// * Linked with: @nestjs/common, ./api/http/v1/list-products.controller, ./application/list-products.handler.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { ListProductsController } from './api/http/v1/list-products.controller';
import { ListProductsHandler } from './application/list-products.handler';

// * Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [ListProductsController],
  providers: [ListProductsHandler],
})
export class ListProductsModule {}
