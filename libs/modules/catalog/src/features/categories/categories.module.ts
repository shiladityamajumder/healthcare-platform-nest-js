// Linked with: @nestjs/common, ./api/http/v1/categories.controller, ./application/categories.handler.
// Used by: the package code that imports this component.
// Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { CategoriesController } from './api/http/v1/categories.controller';
import { CategoriesHandler } from './application/categories.handler';

// Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [CategoriesController],
  providers: [CategoriesHandler],
})
export class CategoriesModule {}
