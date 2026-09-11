// * Linked with: database repositories, migrations, and transaction code.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `pricing.price_books`. */
// * Describe the database row shape consumed by repositories and transaction code.
export interface PricingPriceBooksRow {
  name: string; // VARCHAR(128)
  currency: string; // VARCHAR(3)
  channel: string; // VARCHAR(32)
  region_code: string | null; // VARCHAR(64)
  seller_id: string | null; // UUID
  warehouse_id: string | null; // UUID
  valid_from: Date; // TIMESTAMP WITH TIME ZONE
  valid_until: Date | null; // TIMESTAMP WITH TIME ZONE
  priority: number; // INTEGER
  status: string; // VARCHAR(32)
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
