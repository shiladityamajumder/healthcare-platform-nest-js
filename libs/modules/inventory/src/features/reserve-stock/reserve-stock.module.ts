// * Linked with: @nestjs/common, ./reserve-stock.controller, ./reserve-stock.handler.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { ReserveStockController } from './reserve-stock.controller';
import { ReserveStockHandler } from './reserve-stock.handler';

// * Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [ReserveStockController],
  providers: [ReserveStockHandler],
})
export class ReserveStockModule {}
