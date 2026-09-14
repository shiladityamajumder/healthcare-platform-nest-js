// * Describes the raw PostgreSQL row shape for the payment.payment_intents table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `payment.payment_intents`. */
export interface PaymentPaymentIntentsRow {
  order_id: string; // UUID
  provider_account_id: string | null; // UUID
  provider: string; // VARCHAR(64)
  provider_intent_id: string | null; // VARCHAR(255)
  method: string; // VARCHAR(32)
  amount: string; // NUMERIC(16, 2)
  currency: string; // VARCHAR(3)
  status: string; // VARCHAR(18)
  idempotency_key: string; // VARCHAR(128)
  expires_at: Date | null; // TIMESTAMP WITH TIME ZONE
  metadata_json: unknown; // JSONB
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
