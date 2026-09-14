// * Re-exports the typed PostgreSQL row shapes for the pricing schema.
// * Used by repositories that need compile-time row types without ORM entities.
// ! These exports describe an existing database; they do not create or modify tables.
/** Row shapes for the pricing PostgreSQL schema. */
export type { PricingTaxRulesRow } from './tax_rules';
export type { PricingPromotionsRow } from './promotions';
export type { PricingPricingEvaluationsRow } from './pricing_evaluations';
export type { PricingPromotionVersionsRow } from './promotion_versions';
export type { PricingCouponCodesRow } from './coupon_codes';
export type { PricingPromotionRedemptionsRow } from './promotion_redemptions';
export type { PricingPriceBooksRow } from './price_books';
export type { PricingProductPricesRow } from './product_prices';
