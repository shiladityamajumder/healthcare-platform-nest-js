// * Linked with: @nestjs/common, ./features/price-books/price-books.module, ./features/product-prices/product-prices.module.
// * Used by: the application module or feature root during NestJS startup.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { PriceBooksModule } from './features/price-books/price-books.module';
import { ProductPricesModule } from './features/product-prices/product-prices.module';
import { TaxRulesModule } from './features/tax-rules/tax-rules.module';

/** Composition root for the Pricing bounded context. */
// * Register the feature components and their dependencies with NestJS.
@Module({
  imports: [PriceBooksModule, ProductPricesModule, TaxRulesModule],
  exports: [],
})
export class PricingModule {}
