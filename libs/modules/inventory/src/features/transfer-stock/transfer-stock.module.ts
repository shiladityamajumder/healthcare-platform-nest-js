// * Linked with: @nestjs/common, ./transfer-stock.controller, ./transfer-stock.handler.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { TransferStockController } from './transfer-stock.controller';
import { TransferStockHandler } from './transfer-stock.handler';

// * Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [TransferStockController],
  providers: [TransferStockHandler],
})
export class TransferStockModule {}
