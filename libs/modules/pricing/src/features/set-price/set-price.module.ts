// Linked with: @nestjs/common, ./api/http/v1/set-price.controller, ./application/set-price.handler.
// Used by: the package code that imports this component.
// Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { SetPriceController } from './api/http/v1/set-price.controller';
import { SetPriceHandler } from './application/set-price.handler';

// Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [SetPriceController],
  providers: [SetPriceHandler],
})
export class SetPriceModule {}
