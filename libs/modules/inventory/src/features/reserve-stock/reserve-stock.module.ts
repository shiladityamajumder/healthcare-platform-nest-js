import { Module } from '@nestjs/common';
import { ReserveStockController } from './api/http/v1/reserve-stock.controller';
import { ReserveStockHandler } from './application/reserve-stock.handler';

@Module({
  controllers: [ReserveStockController],
  providers: [ReserveStockHandler],
})
export class ReserveStockModule {}
