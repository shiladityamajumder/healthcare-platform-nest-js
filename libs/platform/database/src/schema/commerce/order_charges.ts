// Linked with: database repositories, migrations, and transaction code.
// Used by: the package code that imports this component.
// Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `commerce.order_charges`. */
// Describe the database row shape consumed by repositories and transaction code.
export interface CommerceOrderChargesRow {
  order_id: string; // UUID
  charge_type: string; // VARCHAR(64)
  description: string | null; // VARCHAR(255)
  amount: string; // NUMERIC(14, 2)
  tax_amount: string; // NUMERIC(14, 2)
  metadata_json: unknown; // JSONB
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
