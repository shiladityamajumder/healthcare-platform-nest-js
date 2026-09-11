// * Linked with: database repositories, migrations, and transaction code.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `payment.chargebacks`. */
// * Describe the database row shape consumed by repositories and transaction code.
export interface PaymentChargebacksRow {
  order_id: string; // UUID
  payment_transaction_id: string; // UUID
  provider: string; // VARCHAR(64)
  provider_chargeback_id: string; // VARCHAR(255)
  amount: string; // NUMERIC(16, 2)
  reason_code: string | null; // VARCHAR(128)
  status: string; // VARCHAR(32)
  evidence_due_at: Date | null; // TIMESTAMP WITH TIME ZONE
  resolved_at: Date | null; // TIMESTAMP WITH TIME ZONE
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
