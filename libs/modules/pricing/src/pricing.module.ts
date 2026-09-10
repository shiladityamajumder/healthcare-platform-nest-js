// Linked with: @nestjs/common, ./features/get-effective-price/get-effective-price.module, ./features/set-price/set-price.module.
// Used by: the application module or feature root during NestJS startup.
// Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { GetEffectivePriceModule } from './features/get-effective-price/get-effective-price.module';
import { SetPriceModule } from './features/set-price/set-price.module';
import { PriceBooksModule } from './features/price-books/price-books.module';
import { TaxRulesModule } from './features/tax-rules/tax-rules.module';

/** Composition root for the Pricing bounded context. */
// Register the feature components and their dependencies with NestJS.
@Module({
  imports: [GetEffectivePriceModule, SetPriceModule, PriceBooksModule, TaxRulesModule],
  exports: [],
})
export class PricingModule {}
