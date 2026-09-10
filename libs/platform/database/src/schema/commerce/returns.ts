// Linked with: database repositories, migrations, and transaction code.
// Used by: the package code that imports this component.
// Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `commerce.returns`. */
// Describe the database row shape consumed by repositories and transaction code.
export interface CommerceReturnsRow {
  return_number: string; // VARCHAR(64)
  order_id: string; // UUID
  user_id: string; // UUID
  status: string; // VARCHAR(32)
  reason_code: string; // VARCHAR(64)
  pickup_required: boolean; // BOOLEAN
  requested_at: Date; // TIMESTAMP WITH TIME ZONE
  completed_at: Date | null; // TIMESTAMP WITH TIME ZONE
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
