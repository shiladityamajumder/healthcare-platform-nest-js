// * Linked with: database repositories, migrations, and transaction code.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `commerce.cancellations`. */
// * Describe the database row shape consumed by repositories and transaction code.
export interface CommerceCancellationsRow {
  order_id: string; // UUID
  requested_by_user_id: string; // UUID
  reason_code: string; // VARCHAR(64)
  reason_text: string | null; // TEXT
  status: string; // VARCHAR(32)
  approved_by_user_id: string | null; // UUID
  resolved_at: Date | null; // TIMESTAMP WITH TIME ZONE
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
