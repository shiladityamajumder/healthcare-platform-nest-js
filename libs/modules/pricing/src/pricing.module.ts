import { Module } from '@nestjs/common';
import { GetEffectivePriceModule } from './features/get-effective-price/get-effective-price.module';
import { SetPriceModule } from './features/set-price/set-price.module';
import { PriceBooksModule } from './features/price-books/price-books.module';
import { TaxRulesModule } from './features/tax-rules/tax-rules.module';

/** Composition root for the Pricing bounded context. */
@Module({
  imports: [
    GetEffectivePriceModule,
    SetPriceModule,
    PriceBooksModule,
    TaxRulesModule
  ],
  exports: [],
})
export class PricingModule {}
