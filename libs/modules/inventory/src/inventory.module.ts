import { Module } from '@nestjs/common';
import { GetStockModule } from './features/get-stock/get-stock.module';
import { ReserveStockModule } from './features/reserve-stock/reserve-stock.module';
import { ReleaseReservationModule } from './features/release-reservation/release-reservation.module';
import { AdjustStockModule } from './features/adjust-stock/adjust-stock.module';
import { TransferStockModule } from './features/transfer-stock/transfer-stock.module';
import { WarehousesModule } from './features/warehouses/warehouses.module';

/** Composition root for the Inventory bounded context. */
@Module({
  imports: [
    GetStockModule,
    ReserveStockModule,
    ReleaseReservationModule,
    AdjustStockModule,
    TransferStockModule,
    WarehousesModule
  ],
  exports: [],
})
export class InventoryModule {}
