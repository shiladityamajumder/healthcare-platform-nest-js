// * Describes the raw PostgreSQL row shape for the notification.message_attempts table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `notification.message_attempts`. */
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
