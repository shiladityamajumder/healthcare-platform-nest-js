/** Raw PostgreSQL row shape for `pricing.promotion_redemptions`. */
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
