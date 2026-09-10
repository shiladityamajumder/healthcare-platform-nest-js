// Linked with: database repositories, migrations, and transaction code.
// Used by: the package code that imports this component.
// Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `marketplace.seller_service_levels`. */
// Describe the database row shape consumed by repositories and transaction code.
export interface MarketplaceSellerServiceLevelsRow {
  seller_id: string; // UUID
  metric_date: Date; // TIMESTAMP WITH TIME ZONE
  fill_rate: string; // NUMERIC(7, 4)
  on_time_rate: string; // NUMERIC(7, 4)
  cancellation_rate: string; // NUMERIC(7, 4)
  quality_score: string | null; // NUMERIC(7, 4)
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
