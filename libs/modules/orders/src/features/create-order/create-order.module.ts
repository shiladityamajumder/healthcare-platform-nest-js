import { Module } from '@nestjs/common';
import { CreateOrderController } from './api/http/v1/create-order.controller';
import { CreateOrderHandler } from './application/create-order.handler';

@Module({
  controllers: [CreateOrderController],
  providers: [CreateOrderHandler],
})
export class CreateOrderModule {}
