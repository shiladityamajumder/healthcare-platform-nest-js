// Linked with: database repositories, migrations, and transaction code.
// Used by: the package code that imports this component.
// Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `notification.messages`. */
// Describe the database row shape consumed by repositories and transaction code.
export interface NotificationMessagesRow {
  user_id: string | null; // UUID
  channel: string; // VARCHAR(16)
  notification_type: string; // VARCHAR(64)
  correlation_id: string | null; // UUID
  destination_encrypted: Buffer | null; // BYTEA
  destination_hash: string | null; // VARCHAR(128)
  template_id: string | null; // UUID
  provider_configuration_id: string | null; // UUID
  payload: unknown; // JSONB
  rendered_subject: string | null; // TEXT
  rendered_body_encrypted: Buffer | null; // BYTEA
  status: string; // VARCHAR(16)
  provider: string | null; // VARCHAR(64)
  provider_message_id: string | null; // VARCHAR(255)
  scheduled_at: Date | null; // TIMESTAMP WITH TIME ZONE
  available_at: Date; // TIMESTAMP WITH TIME ZONE
  next_attempt_at: Date | null; // TIMESTAMP WITH TIME ZONE
  locked_at: Date | null; // TIMESTAMP WITH TIME ZONE
  locked_by: string | null; // VARCHAR(128)
  attempt_count: number; // INTEGER
  max_attempts: number; // INTEGER
  expires_at: Date | null; // TIMESTAMP WITH TIME ZONE
  sent_at: Date | null; // TIMESTAMP WITH TIME ZONE
  delivered_at: Date | null; // TIMESTAMP WITH TIME ZONE
  failed_at: Date | null; // TIMESTAMP WITH TIME ZONE
  failure_reason: string | null; // TEXT
  idempotency_scope: string; // VARCHAR(128)
  idempotency_key: string; // VARCHAR(128)
  priority: number; // INTEGER
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
