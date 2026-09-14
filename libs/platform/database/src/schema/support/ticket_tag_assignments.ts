// * Describes the raw PostgreSQL row shape for the support.ticket_tag_assignments table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `support.ticket_tag_assignments`. */
export interface SupportTicketTagAssignmentsRow {
  ticket_id: string; // UUID
  tag_id: string; // UUID
  id: string; // UUID
  created_at: Date; // TIMESTAMP WITH TIME ZONE
}
