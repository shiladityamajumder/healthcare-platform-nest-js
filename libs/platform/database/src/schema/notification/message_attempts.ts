// Linked with: database repositories, migrations, and transaction code.
// Used by: the package code that imports this component.
// Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `notification.message_attempts`. */
// Describe the database row shape consumed by repositories and transaction code.
export interface NotificationMessageAttemptsRow {
  message_id: string; // UUID
  attempt_number: number; // INTEGER
  provider: string; // VARCHAR(64)
  status: string; // VARCHAR(32)
  provider_response: unknown; // JSONB
  attempted_at: Date; // TIMESTAMP WITH TIME ZONE
  next_retry_at: Date | null; // TIMESTAMP WITH TIME ZONE
  id: string; // UUID
  created_at: Date; // TIMESTAMP WITH TIME ZONE
}
