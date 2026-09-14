// * Describes the raw PostgreSQL row shape for the payment.payment_attempts table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `payment.payment_attempts`. */
export interface PaymentPaymentAttemptsRow {
  payment_intent_id: string; // UUID
  attempt_number: number; // INTEGER
  provider_reference: string | null; // VARCHAR(255)
  amount: string; // NUMERIC(16, 2)
  status: string; // VARCHAR(32)
  initiated_at: Date; // TIMESTAMP WITH TIME ZONE
  completed_at: Date | null; // TIMESTAMP WITH TIME ZONE
  failure_code: string | null; // VARCHAR(128)
  failure_message: string | null; // TEXT
  provider_response: unknown; // JSONB
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
