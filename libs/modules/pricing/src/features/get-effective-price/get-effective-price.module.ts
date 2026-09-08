import { Module } from '@nestjs/common';
import { GetEffectivePriceController } from './api/http/v1/get-effective-price.controller';
import { GetEffectivePriceHandler } from './application/get-effective-price.handler';

@Module({
  controllers: [GetEffectivePriceController],
  providers: [GetEffectivePriceHandler],
})
export class GetEffectivePriceModule {}
