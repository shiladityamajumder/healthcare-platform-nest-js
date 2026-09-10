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
