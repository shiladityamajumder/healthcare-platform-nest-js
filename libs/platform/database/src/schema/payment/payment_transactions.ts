// * Describes the raw PostgreSQL row shape for the payment.payment_transactions table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `payment.payment_transactions`. */
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
