// * Pricing module: Wires database adapters and application collaborators.
// * File: src/infrastructure/pricing-infrastructure.module.ts
// ? Keep SQL and provider details private to the pricing bounded context.
// ! Do not expose pricing persistence outside the feature modules.
/**
 * Registers pricing persistence used by every pricing feature.
 * Used backward by pricing feature modules; connects forward to the platform database.
 */
import { Module } from '@nestjs/common';
import { DatabaseModule } from '@platform/database';
import { PRICING_REPOSITORY } from '../contracts/pricing.ports';
import { PricingRepository } from './persistence/pricing.repository';

@Module({
  imports: [DatabaseModule],
  providers: [PricingRepository, { provide: PRICING_REPOSITORY, useExisting: PricingRepository }],
  exports: [PricingRepository, PRICING_REPOSITORY],
})
export class PricingInfrastructureModule {}
