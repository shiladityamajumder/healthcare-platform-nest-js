import { Module } from '@nestjs/common';
import { SetPriceController } from './api/http/v1/set-price.controller';
import { SetPriceHandler } from './application/set-price.handler';

@Module({
  controllers: [SetPriceController],
  providers: [SetPriceHandler],
})
export class SetPriceModule {}
