import { Module } from '@nestjs/common';
import { GetStockController } from './api/http/v1/get-stock.controller';
import { GetStockHandler } from './application/get-stock.handler';

@Module({
  controllers: [GetStockController],
  providers: [GetStockHandler],
})
export class GetStockModule {}
