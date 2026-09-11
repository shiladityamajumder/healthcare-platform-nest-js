// * Linked with: @nestjs/common, ./api/http/v1/price-books.controller, ./application/price-books.handler.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { PriceBooksController } from './api/http/v1/price-books.controller';
import { PriceBooksHandler } from './application/price-books.handler';

// * Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [PriceBooksController],
  providers: [PriceBooksHandler],
})
export class PriceBooksModule {}
