// * Pricing module: Implements product-price use cases for the product-prices feature.
// * File: src/features/product-prices/product-prices.service.ts
// ? Keep product-price orchestration behind the feature service boundary.
// ! Do not move SQL or transport concerns into this service.
import { Inject, Injectable } from '@nestjs/common';
import { PricingService } from '../../application/pricing.service';
import { PRICING_REPOSITORY, type PricingRepositoryPort } from '../../contracts/pricing.ports';

/** Product-price-facing service boundary backed by the pricing application workflow. */
@Injectable()
export class ProductPricesService extends PricingService {
  // * Function [constructor]: Initializes the feature service with the pricing repository port.
  public constructor(@Inject(PRICING_REPOSITORY) repository: PricingRepositoryPort) {
    super(repository);
  }
}
