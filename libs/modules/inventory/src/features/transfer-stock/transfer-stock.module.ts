import { Module } from '@nestjs/common';
import { TransferStockController } from './api/http/v1/transfer-stock.controller';
import { TransferStockHandler } from './application/transfer-stock.handler';

@Module({
  controllers: [TransferStockController],
  providers: [TransferStockHandler],
})
export class TransferStockModule {}
