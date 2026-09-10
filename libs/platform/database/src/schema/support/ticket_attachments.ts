/** Raw PostgreSQL row shape for `support.ticket_attachments`. */
export interface SupportTicketAttachmentsRow {
  ticket_id: string; // UUID
  ticket_message_id: string | null; // UUID
  file_object_id: string; // UUID
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
