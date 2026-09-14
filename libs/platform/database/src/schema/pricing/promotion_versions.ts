// * Describes the raw PostgreSQL row shape for the pricing.promotion_versions table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `pricing.promotion_versions`. */
export interface PricingPromotionVersionsRow {
  promotion_id: string; // UUID
  version_no: number; // INTEGER
  rules: unknown; // JSONB
  benefits: unknown; // JSONB
  published_at: Date | null; // TIMESTAMP WITH TIME ZONE
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
