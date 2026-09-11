// * Linked with: database repositories, migrations, and transaction code.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `commerce.checkouts`. */
// * Describe the database row shape consumed by repositories and transaction code.
export interface CommerceCheckoutsRow {
  checkout_number: string; // VARCHAR(64)
  cart_id: string; // UUID
  user_id: string; // UUID
  address_id: string; // UUID
  status: string; // VARCHAR(16)
  pricing_snapshot: unknown; // JSONB
  inventory_snapshot: unknown; // JSONB
  serviceability_snapshot: unknown; // JSONB
  prescription_snapshot: unknown; // JSONB
  expires_at: Date; // TIMESTAMP WITH TIME ZONE
  idempotency_key: string; // VARCHAR(128)
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
