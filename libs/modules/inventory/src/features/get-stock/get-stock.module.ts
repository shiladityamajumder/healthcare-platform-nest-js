// * Linked with: @nestjs/common, ./api/http/v1/get-stock.controller, ./application/get-stock.handler.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { GetStockController } from './api/http/v1/get-stock.controller';
import { GetStockHandler } from './application/get-stock.handler';

// * Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [GetStockController],
  providers: [GetStockHandler],
})
export class GetStockModule {}
