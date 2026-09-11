// * Linked with: @nestjs/common, ./features/create-order/create-order.module, ./features/get-order/get-order.module.
// * Used by: the application module or feature root during NestJS startup.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { CreateOrderModule } from './features/create-order/create-order.module';
import { GetOrderModule } from './features/get-order/get-order.module';
import { ListOrdersModule } from './features/list-orders/list-orders.module';
import { CancelOrderModule } from './features/cancel-order/cancel-order.module';
import { UpdateStatusModule } from './features/update-status/update-status.module';
import { ReturnsModule } from './features/returns/returns.module';

/** Composition root for the Orders bounded context. */
// * Register the feature components and their dependencies with NestJS.
@Module({
  imports: [
    CreateOrderModule,
    GetOrderModule,
    ListOrdersModule,
    CancelOrderModule,
    UpdateStatusModule,
    ReturnsModule,
  ],
  exports: [],
})
export class OrdersModule {}
