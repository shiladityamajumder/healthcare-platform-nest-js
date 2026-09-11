// * Linked with: database repositories, migrations, and transaction code.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `payment.reconciliation_items`. */
// * Describe the database row shape consumed by repositories and transaction code.
export interface PaymentReconciliationItemsRow {
  run_id: string; // UUID
  provider_reference: string; // VARCHAR(255)
  internal_reference: string | null; // VARCHAR(255)
  expected_amount: string | null; // NUMERIC(16, 2)
  actual_amount: string | null; // NUMERIC(16, 2)
  status: string; // VARCHAR(32)
  resolution_notes: string | null; // TEXT
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
