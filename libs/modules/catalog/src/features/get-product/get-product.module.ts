import { Module } from '@nestjs/common';
import { GetProductController } from './api/http/v1/get-product.controller';
import { GetProductHandler } from './application/get-product.handler';

@Module({
  controllers: [GetProductController],
  providers: [GetProductHandler],
})
export class GetProductModule {}
