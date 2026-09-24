// * Pricing module: Registers promotions, coupons, redemptions, and evaluation features.
// * File: src/features/promotions/promotions.module.ts
// ? Keep promotion workflows behind the same pricing infrastructure boundary.
import { Module } from '@nestjs/common';
import { PricingInfrastructureModule } from '../../infrastructure/pricing-infrastructure.module';
import {
  CouponCodesController,
  PricingEvaluationsController,
  PromotionRedemptionsController,
  PromotionsController,
} from './promotions.controller';
import { PromotionsService } from './promotions.service';

@Module({
  imports: [PricingInfrastructureModule],
  controllers: [
    PromotionsController,
    CouponCodesController,
    PromotionRedemptionsController,
    PricingEvaluationsController,
  ],
  providers: [PromotionsService],
})
/** Registers promotion-related controllers and the shared pricing application service. */
export class PromotionsModule {}
