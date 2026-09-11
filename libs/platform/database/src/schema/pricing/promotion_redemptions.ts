// * Linked with: database repositories, migrations, and transaction code.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `pricing.promotion_redemptions`. */
// * Describe the database row shape consumed by repositories and transaction code.
export interface PricingPromotionRedemptionsRow {
  promotion_id: string; // UUID
  promotion_version_id: string | null; // UUID
  coupon_code_id: string | null; // UUID
  user_id: string; // UUID
  order_id: string | null; // UUID
  discount_amount: string; // NUMERIC(14, 2)
  redeemed_at: Date; // TIMESTAMP WITH TIME ZONE
  idempotency_key: string; // VARCHAR(128)
  id: string; // UUID
  created_at: Date; // TIMESTAMP WITH TIME ZONE
}
