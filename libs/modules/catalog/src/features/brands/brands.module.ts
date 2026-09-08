import { Module } from '@nestjs/common';
import { BrandsController } from './api/http/v1/brands.controller';
import { BrandsHandler } from './application/brands.handler';

@Module({
  controllers: [BrandsController],
  providers: [BrandsHandler],
})
export class BrandsModule {}
