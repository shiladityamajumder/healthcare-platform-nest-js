// * Describes the raw PostgreSQL row shape for the support.ticket_attachments table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
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
