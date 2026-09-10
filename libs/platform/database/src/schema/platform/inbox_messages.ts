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
