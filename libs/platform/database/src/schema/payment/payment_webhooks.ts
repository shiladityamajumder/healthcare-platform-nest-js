// * Linked with: database repositories, migrations, and transaction code.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `payment.payment_webhooks`. */
// * Describe the database row shape consumed by repositories and transaction code.
export interface PaymentPaymentWebhooksRow {
  provider: string; // VARCHAR(64)
  provider_event_id: string; // VARCHAR(255)
  event_type: string | null; // VARCHAR(128)
  signature_valid: boolean; // BOOLEAN
  payload: unknown; // JSONB
  processing_status: string; // VARCHAR(32)
  processing_attempts: number; // INTEGER
  processed_at: Date | null; // TIMESTAMP WITH TIME ZONE
  error_message: string | null; // TEXT
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
