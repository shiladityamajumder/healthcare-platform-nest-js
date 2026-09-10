// Linked with: database repositories, migrations, and transaction code.
// Used by: the package code that imports this component.
// Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `compliance.recall_lots`. */
// Describe the database row shape consumed by repositories and transaction code.
export interface ComplianceRecallLotsRow {
  recall_id: string; // UUID
  lot_id: string; // UUID
  affected_quantity: string | null; // VARCHAR(64)
  action_status: string; // VARCHAR(32)
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
