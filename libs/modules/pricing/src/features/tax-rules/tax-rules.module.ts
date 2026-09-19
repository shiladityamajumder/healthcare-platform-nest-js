// * Pricing module: Registers the tax-rules feature.
// * File: src/features/tax-rules/tax-rules.module.ts
// ? Keep this feature boundary focused on tax-rule transport and application behavior.
import { Module } from '@nestjs/common';
import { PricingInfrastructureModule } from '../../infrastructure/pricing-infrastructure.module';
import { TaxRulesController } from './tax-rules.controller';
import { TaxRulesService } from './tax-rules.service';

@Module({
  imports: [PricingInfrastructureModule],
  controllers: [TaxRulesController],
  providers: [TaxRulesService],
})
export class TaxRulesModule {}
