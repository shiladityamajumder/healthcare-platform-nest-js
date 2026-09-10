// Linked with: database repositories, migrations, and transaction code.
// Used by: the package code that imports this component.
// Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `support.ticket_tag_assignments`. */
// Describe the database row shape consumed by repositories and transaction code.
export interface SupportTicketTagAssignmentsRow {
  ticket_id: string; // UUID
  tag_id: string; // UUID
  id: string; // UUID
  created_at: Date; // TIMESTAMP WITH TIME ZONE
}
