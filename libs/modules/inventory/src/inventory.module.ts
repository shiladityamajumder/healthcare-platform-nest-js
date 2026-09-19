// * Linked with: @nestjs/common, ./features/get-stock/get-stock.module, ./features/reserve-stock/reserve-stock.module.
// * Used by: the application module or feature root during NestJS startup.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { WarehousesModule } from './features/warehouses/warehouses.module';
import { InventoryRoutesModule } from './features/inventory-routes/inventory-routes.module';

/** Composition root for the Inventory bounded context. */
// * Register the feature components and their dependencies with NestJS.
@Module({
  imports: [WarehousesModule, InventoryRoutesModule],
  exports: [],
})
export class InventoryModule {}
