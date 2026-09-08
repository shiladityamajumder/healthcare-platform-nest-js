import { Module } from '@nestjs/common';
import { ListProductsController } from './api/http/v1/list-products.controller';
import { ListProductsHandler } from './application/list-products.handler';

@Module({
  controllers: [ListProductsController],
  providers: [ListProductsHandler],
})
export class ListProductsModule {}
