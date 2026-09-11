// * Linked with: @nestjs/common, ./api/http/v1/addresses.controller, ./application/addresses.handler.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { AddressesController } from './api/http/v1/addresses.controller';
import { AddressesHandler } from './application/addresses.handler';

// * Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [AddressesController],
  providers: [AddressesHandler],
})
export class AddressesModule {}
