// * Linked with: @nestjs/common, ./api/http/v1/transfer-stock.controller, ./application/transfer-stock.handler.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { TransferStockController } from './api/http/v1/transfer-stock.controller';
import { TransferStockHandler } from './application/transfer-stock.handler';

// * Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [TransferStockController],
  providers: [TransferStockHandler],
})
export class TransferStockModule {}
