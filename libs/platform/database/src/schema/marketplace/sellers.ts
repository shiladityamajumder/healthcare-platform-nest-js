// * Linked with: database repositories, migrations, and transaction code.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `marketplace.sellers`. */
// * Describe the database row shape consumed by repositories and transaction code.
export interface MarketplaceSellersRow {
  organization_id: string; // UUID
  seller_code: string; // VARCHAR(64)
  display_name: string; // VARCHAR(255)
  seller_type: string; // VARCHAR(32)
  verification_status: string; // VARCHAR(16)
  status: string; // VARCHAR(32)
  commission_plan_id: string | null; // UUID
  settlement_cycle: string; // VARCHAR(32)
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
