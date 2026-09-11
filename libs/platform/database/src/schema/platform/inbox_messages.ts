// * Linked with: database repositories, migrations, and transaction code.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `platform.inbox_messages`. */
// * Describe the database row shape consumed by repositories and transaction code.
export interface PlatformInboxMessagesRow {
  consumer_name: string; // VARCHAR(128)
  message_id: string; // UUID
  event_type: string; // VARCHAR(128)
  payload_hash: string | null; // VARCHAR(64)
  received_at: Date; // TIMESTAMP WITH TIME ZONE
  processed_at: Date | null; // TIMESTAMP WITH TIME ZONE
  result: string; // VARCHAR(32)
  error_message: string | null; // TEXT
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
