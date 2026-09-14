// * Linked with: @nestjs/common, ./categories.controller, ./categories.handler.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesHandler } from './categories.handler';

// * Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [CategoriesController],
  providers: [CategoriesHandler],
})
export class CategoriesModule {}
