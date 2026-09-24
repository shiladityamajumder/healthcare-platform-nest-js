import { Module } from '@nestjs/common';
import { InventoryRoutesController } from './inventory-routes.controller';
import { InventoryRoutesHandler } from './inventory-routes.handler';
import { InventoryInfrastructureModule } from '../../infrastructure/inventory-infrastructure.module';

@Module({
  imports: [InventoryInfrastructureModule],
  controllers: [InventoryRoutesController],
  providers: [InventoryRoutesHandler],
})
/** Registers the mounted inventory routes and their application dependency boundary. */
export class InventoryRoutesModule {}
