import { Module } from '@nestjs/common';
import { UpdateProductController } from './api/http/v1/update-product.controller';
import { UpdateProductHandler } from './application/update-product.handler';

@Module({
  controllers: [UpdateProductController],
  providers: [UpdateProductHandler],
})
export class UpdateProductModule {}
