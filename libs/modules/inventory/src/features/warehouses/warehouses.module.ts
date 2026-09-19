// * Linked with: @nestjs/common, ./warehouses.controller, ./warehouses.handler.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { WarehousesController } from './warehouses.controller';
import { WarehousesHandler } from './warehouses.handler';
import { ReplenishmentRulesController } from './replenishment-rules.controller';

// * Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [WarehousesController, ReplenishmentRulesController],
  providers: [WarehousesHandler],
})
export class WarehousesModule {}
