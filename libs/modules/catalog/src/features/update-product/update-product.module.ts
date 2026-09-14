// * Linked with: @nestjs/common, ./update-product.controller, ./update-product.handler.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { UpdateProductController } from './update-product.controller';
import { UpdateProductHandler } from './update-product.handler';

// * Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [UpdateProductController],
  providers: [UpdateProductHandler],
})
export class UpdateProductModule {}
