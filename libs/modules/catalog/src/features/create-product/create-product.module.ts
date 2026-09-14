// * Linked with: @nestjs/common, ./create-product.controller, ./create-product.handler.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { CreateProductController } from './create-product.controller';
import { CreateProductHandler } from './create-product.handler';

// * Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [CreateProductController],
  providers: [CreateProductHandler],
})
export class CreateProductModule {}
