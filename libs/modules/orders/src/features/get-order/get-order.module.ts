import { Module } from '@nestjs/common';
import { GetOrderController } from './api/http/v1/get-order.controller';
import { GetOrderHandler } from './application/get-order.handler';

@Module({
  controllers: [GetOrderController],
  providers: [GetOrderHandler],
})
export class GetOrderModule {}
