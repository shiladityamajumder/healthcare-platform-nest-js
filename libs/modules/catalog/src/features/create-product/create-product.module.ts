// Linked with: @nestjs/common, ./api/http/v1/create-product.controller, ./application/create-product.handler.
// Used by: the package code that imports this component.
// Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { CreateProductController } from './api/http/v1/create-product.controller';
import { CreateProductHandler } from './application/create-product.handler';

// Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [CreateProductController],
  providers: [CreateProductHandler],
})
export class CreateProductModule {}
