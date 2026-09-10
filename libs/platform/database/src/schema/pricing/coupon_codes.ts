/** Raw PostgreSQL row shape for `pricing.coupon_codes`. */
export interface PricingCouponCodesRow {
  promotion_id: string; // UUID
  code: string; // VARCHAR(64)
  max_redemptions: number | null; // INTEGER
  assigned_user_id: string | null; // UUID
  valid_from: Date | null; // TIMESTAMP WITH TIME ZONE
  valid_until: Date | null; // TIMESTAMP WITH TIME ZONE
  is_active: boolean; // BOOLEAN
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  is_deleted: boolean; // BOOLEAN
  deleted_at: Date | null; // TIMESTAMP WITH TIME ZONE
  deleted_by: string | null; // UUID
  row_version: string; // BIGINT
}
