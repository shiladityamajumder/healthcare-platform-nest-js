// * Linked with: @nestjs/common, ./addresses.controller, ./addresses.handler.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { AddressesController } from './addresses.controller';
import { AddressesHandler } from './addresses.handler';

// * Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [AddressesController],
  providers: [AddressesHandler],
})
export class AddressesModule {}
