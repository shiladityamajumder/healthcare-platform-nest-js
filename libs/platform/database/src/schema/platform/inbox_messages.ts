// * Describes the raw PostgreSQL row shape for the platform.inbox_messages table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `platform.inbox_messages`. */
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
