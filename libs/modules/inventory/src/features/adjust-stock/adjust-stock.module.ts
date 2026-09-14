// * Linked with: @nestjs/common, ./adjust-stock.controller, ./adjust-stock.handler.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { AdjustStockController } from './adjust-stock.controller';
import { AdjustStockHandler } from './adjust-stock.handler';

// * Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [AdjustStockController],
  providers: [AdjustStockHandler],
})
export class AdjustStockModule {}
