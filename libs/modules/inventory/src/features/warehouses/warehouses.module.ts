import { Module } from '@nestjs/common';
import { WarehousesController } from './api/http/v1/warehouses.controller';
import { WarehousesHandler } from './application/warehouses.handler';

@Module({
  controllers: [WarehousesController],
  providers: [WarehousesHandler],
})
export class WarehousesModule {}
