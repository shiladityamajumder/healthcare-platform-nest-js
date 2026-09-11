// * Linked with: database repositories, migrations, and transaction code.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `notification.provider_webhooks`. */
// * Describe the database row shape consumed by repositories and transaction code.
export interface NotificationProviderWebhooksRow {
  provider: string; // VARCHAR(64)
  provider_event_id: string; // VARCHAR(255)
  provider_message_id: string | null; // VARCHAR(255)
  payload: unknown; // JSONB
  signature_valid: boolean; // BOOLEAN
  processing_status: string; // VARCHAR(32)
  processed_at: Date | null; // TIMESTAMP WITH TIME ZONE
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
