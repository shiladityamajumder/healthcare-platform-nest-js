// Linked with: database repositories, migrations, and transaction code.
// Used by: the package code that imports this component.
// Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `payment.payment_transactions`. */
// Describe the database row shape consumed by repositories and transaction code.
export interface PaymentPaymentTransactionsRow {
  payment_intent_id: string; // UUID
  payment_attempt_id: string | null; // UUID
  provider: string; // VARCHAR(64)
  provider_transaction_id: string | null; // VARCHAR(255)
  transaction_type: string; // VARCHAR(32)
  amount: string; // NUMERIC(16, 2)
  status: string; // VARCHAR(32)
  provider_response: unknown; // JSONB
  processed_at: Date | null; // TIMESTAMP WITH TIME ZONE
  id: string; // UUID
  created_at: Date; // TIMESTAMP WITH TIME ZONE
}
