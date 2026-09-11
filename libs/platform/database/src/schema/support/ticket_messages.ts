// * Linked with: database repositories, migrations, and transaction code.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `support.ticket_messages`. */
// * Describe the database row shape consumed by repositories and transaction code.
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
