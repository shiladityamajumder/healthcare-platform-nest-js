import { Module } from '@nestjs/common';
import { InventoryRoutesController } from './inventory-routes.controller';
import { InventoryRoutesHandler } from './inventory-routes.handler';

@Module({
  controllers: [InventoryRoutesController],
  providers: [InventoryRoutesHandler],
})
export class InventoryRoutesModule {}
