import { Module } from '@nestjs/common';
import { PriceBooksController } from './api/http/v1/price-books.controller';
import { PriceBooksHandler } from './application/price-books.handler';

@Module({
  controllers: [PriceBooksController],
  providers: [PriceBooksHandler],
})
export class PriceBooksModule {}
