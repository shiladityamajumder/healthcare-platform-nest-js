// * Describes the raw PostgreSQL row shape for the payment.refunds table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `payment.refunds`. */
export interface PaymentRefundsRow {
  refund_number: string; // VARCHAR(64)
  order_id: string; // UUID
  return_id: string | null; // UUID
  payment_transaction_id: string | null; // UUID
  amount: string; // NUMERIC(16, 2)
  reason_code: string; // VARCHAR(64)
  status: string; // VARCHAR(16)
  provider_refund_id: string | null; // VARCHAR(255)
  idempotency_key: string; // VARCHAR(128)
  processed_at: Date | null; // TIMESTAMP WITH TIME ZONE
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
