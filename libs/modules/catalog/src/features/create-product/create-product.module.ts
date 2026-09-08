import { Module } from '@nestjs/common';
import { CreateProductController } from './api/http/v1/create-product.controller';
import { CreateProductHandler } from './application/create-product.handler';

@Module({
  controllers: [CreateProductController],
  providers: [CreateProductHandler],
})
export class CreateProductModule {}
