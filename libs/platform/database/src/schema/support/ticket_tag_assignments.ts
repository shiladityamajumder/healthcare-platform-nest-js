/** Raw PostgreSQL row shape for `support.ticket_tag_assignments`. */
export interface SupportTicketTagAssignmentsRow {
  ticket_id: string; // UUID
  tag_id: string; // UUID
  id: string; // UUID
  created_at: Date; // TIMESTAMP WITH TIME ZONE
}
