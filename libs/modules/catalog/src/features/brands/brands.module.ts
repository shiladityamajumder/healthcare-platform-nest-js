// * Linked with: @nestjs/common, ./brands.controller, ./brands.handler.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { BrandsController } from './brands.controller';
import { BrandsHandler } from './brands.handler';

// * Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [BrandsController],
  providers: [BrandsHandler],
})
export class BrandsModule {}
