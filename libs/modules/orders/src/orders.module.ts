import { Module } from '@nestjs/common';
import { CreateOrderModule } from './features/create-order/create-order.module';
import { GetOrderModule } from './features/get-order/get-order.module';
import { ListOrdersModule } from './features/list-orders/list-orders.module';
import { CancelOrderModule } from './features/cancel-order/cancel-order.module';
import { UpdateStatusModule } from './features/update-status/update-status.module';
import { ReturnsModule } from './features/returns/returns.module';

/** Composition root for the Orders bounded context. */
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
