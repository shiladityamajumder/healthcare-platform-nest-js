// * Describes the raw PostgreSQL row shape for the support.ticket_actions table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `support.ticket_actions`. */
export interface SupportTicketActionsRow {
  ticket_id: string; // UUID
  action_type: string; // VARCHAR(64)
  requested_by_user_id: string; // UUID
  approved_by_user_id: string | null; // UUID
  status: string; // VARCHAR(32)
  payload: unknown; // JSONB
  executed_at: Date | null; // TIMESTAMP WITH TIME ZONE
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
