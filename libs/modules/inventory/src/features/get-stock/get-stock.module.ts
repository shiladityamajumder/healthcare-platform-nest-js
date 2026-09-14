// * Linked with: @nestjs/common, ./get-stock.controller, ./get-stock.handler.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { GetStockController } from './get-stock.controller';
import { GetStockHandler } from './get-stock.handler';

// * Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [GetStockController],
  providers: [GetStockHandler],
})
export class GetStockModule {}
