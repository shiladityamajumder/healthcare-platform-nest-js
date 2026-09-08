import { Module } from '@nestjs/common';
import { ListOrdersController } from './api/http/v1/list-orders.controller';
import { ListOrdersHandler } from './application/list-orders.handler';

@Module({
  controllers: [ListOrdersController],
  providers: [ListOrdersHandler],
})
export class ListOrdersModule {}
