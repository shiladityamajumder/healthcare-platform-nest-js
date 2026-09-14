// * Linked with: @nestjs/common, ./get-effective-price.controller, ./get-effective-price.handler.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { GetEffectivePriceController } from './get-effective-price.controller';
import { GetEffectivePriceHandler } from './get-effective-price.handler';

// * Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [GetEffectivePriceController],
  providers: [GetEffectivePriceHandler],
})
export class GetEffectivePriceModule {}
