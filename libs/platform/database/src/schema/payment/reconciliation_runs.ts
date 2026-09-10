// Linked with: database repositories, migrations, and transaction code.
// Used by: the package code that imports this component.
// Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `payment.reconciliation_runs`. */
// Describe the database row shape consumed by repositories and transaction code.
export interface PaymentReconciliationRunsRow {
  provider: string; // VARCHAR(64)
  account_id: string | null; // UUID
  run_date: string; // DATE
  status: string; // VARCHAR(32)
  source_file_id: string | null; // UUID
  summary: unknown; // JSONB
  started_at: Date; // TIMESTAMP WITH TIME ZONE
  completed_at: Date | null; // TIMESTAMP WITH TIME ZONE
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
