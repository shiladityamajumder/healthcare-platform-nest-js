// * Linked with: database repositories, migrations, and transaction code.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `pricing.coupon_codes`. */
// * Describe the database row shape consumed by repositories and transaction code.
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
