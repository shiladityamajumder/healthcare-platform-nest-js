// Linked with: database repositories, migrations, and transaction code.
// Used by: the package code that imports this component.
// Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `pricing.promotion_versions`. */
// Describe the database row shape consumed by repositories and transaction code.
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
