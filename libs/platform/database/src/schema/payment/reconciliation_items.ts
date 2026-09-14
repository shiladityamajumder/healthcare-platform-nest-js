// * Describes the raw PostgreSQL row shape for the payment.reconciliation_items table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `payment.reconciliation_items`. */
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
