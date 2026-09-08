import { Module } from '@nestjs/common';
import { AdjustStockController } from './api/http/v1/adjust-stock.controller';
import { AdjustStockHandler } from './application/adjust-stock.handler';

@Module({
  controllers: [AdjustStockController],
  providers: [AdjustStockHandler],
})
export class AdjustStockModule {}
