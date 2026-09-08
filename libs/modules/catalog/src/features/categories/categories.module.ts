import { Module } from '@nestjs/common';
import { CategoriesController } from './api/http/v1/categories.controller';
import { CategoriesHandler } from './application/categories.handler';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesHandler],
})
export class CategoriesModule {}
