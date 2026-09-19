// * Pricing module: Implements price-book use cases for the price-books feature.
// * File: src/features/price-books/price-books.service.ts
// ? Keep price-book orchestration behind the feature service boundary.
// ! Do not move SQL or transport concerns into this service.
import { Inject, Injectable } from '@nestjs/common';
import { PricingService } from '../../application/pricing.service';
import { PRICING_REPOSITORY, type PricingRepositoryPort } from '../../contracts/pricing.ports';

/** Price-book-facing service boundary backed by the pricing application workflow. */
@Injectable()
export class PriceBooksService extends PricingService {
  public constructor(@Inject(PRICING_REPOSITORY) repository: PricingRepositoryPort) {
    super(repository);
  }
}
