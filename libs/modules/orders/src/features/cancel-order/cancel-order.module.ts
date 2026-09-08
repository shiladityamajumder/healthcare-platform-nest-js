import { Module } from '@nestjs/common';
import { CancelOrderController } from './api/http/v1/cancel-order.controller';
import { CancelOrderHandler } from './application/cancel-order.handler';

@Module({
  controllers: [CancelOrderController],
  providers: [CancelOrderHandler],
})
export class CancelOrderModule {}
