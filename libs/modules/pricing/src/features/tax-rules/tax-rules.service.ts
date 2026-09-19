// * Pricing module: Implements tax-rule use cases for the tax-rules feature.
// * File: src/features/tax-rules/tax-rules.service.ts
// ? Keep tax-rule orchestration behind the feature service boundary.
// ! Do not move SQL or transport concerns into this service.
import { Inject, Injectable } from '@nestjs/common';
import { PricingService } from '../../application/pricing.service';
import { PRICING_REPOSITORY, type PricingRepositoryPort } from '../../contracts/pricing.ports';

/** Tax-rule-facing service boundary backed by the pricing application workflow. */
@Injectable()
export class TaxRulesService extends PricingService {
  public constructor(@Inject(PRICING_REPOSITORY) repository: PricingRepositoryPort) {
    super(repository);
  }
}
