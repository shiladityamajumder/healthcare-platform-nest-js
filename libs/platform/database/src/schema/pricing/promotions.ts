// * Describes the raw PostgreSQL row shape for the pricing.promotions table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `pricing.promotions`. */
export interface PricingPromotionsRow {
  code: string; // VARCHAR(64)
  name: string; // VARCHAR(255)
  promotion_type: string; // VARCHAR(32)
  stackability_group: string | null; // VARCHAR(64)
  priority: number; // INTEGER
  budget_amount: string | null; // NUMERIC(16, 2)
  usage_limit: number | null; // INTEGER
  per_user_limit: number | null; // INTEGER
  starts_at: Date; // TIMESTAMP WITH TIME ZONE
  ends_at: Date | null; // TIMESTAMP WITH TIME ZONE
  status: string; // VARCHAR(32)
  exclusive: boolean; // BOOLEAN
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
