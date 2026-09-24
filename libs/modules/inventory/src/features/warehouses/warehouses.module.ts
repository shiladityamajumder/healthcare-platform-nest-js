// * Linked with: @nestjs/common, ./warehouses.controller, ./warehouses.handler.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { WarehousesController } from './warehouses.controller';
import { WarehousesHandler } from './warehouses.handler';
import { ReplenishmentRulesController } from './replenishment-rules.controller';
import { InventoryInfrastructureModule } from '../../infrastructure/inventory-infrastructure.module';

// * Define the shared types or behavior used by the surrounding package.
@Module({
  imports: [InventoryInfrastructureModule],
  controllers: [WarehousesController, ReplenishmentRulesController],
  providers: [WarehousesHandler],
})
/** Registers warehouse and replenishment routes with the inventory infrastructure boundary. */
export class WarehousesModule {}
