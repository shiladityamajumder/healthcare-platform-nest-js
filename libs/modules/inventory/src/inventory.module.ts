// * Linked with: @nestjs/common, ./features/get-stock/get-stock.module, ./features/reserve-stock/reserve-stock.module.
// * Used by: the application module or feature root during NestJS startup.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { GetStockModule } from './features/get-stock/get-stock.module';
import { ReserveStockModule } from './features/reserve-stock/reserve-stock.module';
import { ReleaseReservationModule } from './features/release-reservation/release-reservation.module';
import { AdjustStockModule } from './features/adjust-stock/adjust-stock.module';
import { TransferStockModule } from './features/transfer-stock/transfer-stock.module';
import { WarehousesModule } from './features/warehouses/warehouses.module';

/** Composition root for the Inventory bounded context. */
// * Register the feature components and their dependencies with NestJS.
@Module({
  imports: [
    GetStockModule,
    ReserveStockModule,
    ReleaseReservationModule,
    AdjustStockModule,
    TransferStockModule,
    WarehousesModule,
  ],
  exports: [],
})
export class InventoryModule {}
