// Linked with: @nestjs/common, ./api/http/v1/warehouses.controller, ./application/warehouses.handler.
// Used by: the package code that imports this component.
// Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { WarehousesController } from './api/http/v1/warehouses.controller';
import { WarehousesHandler } from './application/warehouses.handler';

// Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [WarehousesController],
  providers: [WarehousesHandler],
})
export class WarehousesModule {}
