// * Inventory module: Wires the existing database adapter to inventory application ports.
// * File: src/infrastructure/inventory-infrastructure.module.ts
// ? Keep SQL implementation details private to the inventory bounded context.
// ! Do not add migrations or schema ownership to this module.
import { Module } from '@nestjs/common';
import { DatabaseModule } from '@platform/database';
import { INVENTORY_REPOSITORY } from '../contracts/inventory.ports';
import { InventoryRepository } from './persistence/inventory.repository';

@Module({
  imports: [DatabaseModule],
  providers: [InventoryRepository, { provide: INVENTORY_REPOSITORY, useExisting: InventoryRepository }],
  exports: [InventoryRepository, INVENTORY_REPOSITORY],
})
/** Provides the inventory repository adapter without owning database schema lifecycle. */
export class InventoryInfrastructureModule {}
