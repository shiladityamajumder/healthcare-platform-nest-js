// * Pricing module: Implements promotion and pricing-audit use cases.
// * File: src/features/promotions/promotions.service.ts
// ? Keep promotion orchestration behind the feature service boundary.
// ! Do not move SQL or transport concerns into this service.
import { Inject, Injectable } from '@nestjs/common';
import { PricingService } from '../../application/pricing.service';
import { PRICING_REPOSITORY, type PricingRepositoryPort } from '../../contracts/pricing.ports';

/** Promotion-facing service boundary backed by the pricing application workflow. */
@Injectable()
export class PromotionsService extends PricingService {
  // * Function [constructor]: Initializes the feature service with the pricing repository port.
  public constructor(@Inject(PRICING_REPOSITORY) repository: PricingRepositoryPort) {
    super(repository);
  }
}
