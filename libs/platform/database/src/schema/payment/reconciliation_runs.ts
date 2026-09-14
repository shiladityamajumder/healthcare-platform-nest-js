// * Describes the raw PostgreSQL row shape for the payment.reconciliation_runs table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `payment.reconciliation_runs`. */
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
