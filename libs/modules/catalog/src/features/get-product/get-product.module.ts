// * Linked with: @nestjs/common, ./api/http/v1/get-product.controller, ./application/get-product.handler.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { GetProductController } from './api/http/v1/get-product.controller';
import { GetProductHandler } from './application/get-product.handler';

// * Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [GetProductController],
  providers: [GetProductHandler],
})
export class GetProductModule {}
