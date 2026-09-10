/** Raw PostgreSQL row shape for `support.ticket_messages`. */
export interface SupportTicketMessagesRow {
  ticket_id: string; // UUID
  author_user_id: string | null; // UUID
  author_type: string; // VARCHAR(32)
  message_type: string; // VARCHAR(32)
  body: string; // TEXT
  is_internal: boolean; // BOOLEAN
  channel: string; // VARCHAR(32)
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
