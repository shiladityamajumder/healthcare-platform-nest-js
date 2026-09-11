// * Linked with: ./tax_rules, ./promotions, ./pricing_evaluations.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Row shapes for the pricing PostgreSQL schema. */
// * Describe the database row shape consumed by repositories and transaction code.
export type { PricingTaxRulesRow } from './tax_rules';
export type { PricingPromotionsRow } from './promotions';
export type { PricingPricingEvaluationsRow } from './pricing_evaluations';
export type { PricingPromotionVersionsRow } from './promotion_versions';
export type { PricingCouponCodesRow } from './coupon_codes';
export type { PricingPromotionRedemptionsRow } from './promotion_redemptions';
export type { PricingPriceBooksRow } from './price_books';
export type { PricingProductPricesRow } from './product_prices';
