// * Describes the raw PostgreSQL row shape for the support.ticket_status_history table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `support.ticket_status_history`. */
export interface SupportTicketStatusHistoryRow {
  ticket_id: string; // UUID
  from_status: string | null; // VARCHAR(32)
  to_status: string; // VARCHAR(32)
  actor_user_id: string | null; // UUID
  reason: string | null; // TEXT
  id: string; // UUID
  created_at: Date; // TIMESTAMP WITH TIME ZONE
}
