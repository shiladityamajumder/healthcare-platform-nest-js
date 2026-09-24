// * Pricing module: Defines validated DTOs for promotions, coupons, redemptions, and evaluations.
// * File: src/features/promotions/promotions.schema.ts
// ? Keep transport contracts close to the promotion feature like the auth schemas.
export {
  CouponCodeCreateDto,
  CouponCodeListQueryDto,
  CouponCodeUpdateDto,
  PricingEvaluationCreateDto,
  PricingEvaluationListQueryDto,
  PromotionCreateDto,
  PromotionListQueryDto,
  PromotionRedemptionCreateDto,
  PromotionRedemptionListQueryDto,
  PromotionUpdateDto,
  PromotionVersionCreateDto,
  PromotionVersionListQueryDto,
} from '../../contracts/pricing.schema';
