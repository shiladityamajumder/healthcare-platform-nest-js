// Linked with: database repositories, migrations, and transaction code.
// Used by: the package code that imports this component.
// Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `support.ticket_status_history`. */
// Describe the database row shape consumed by repositories and transaction code.
export interface SupportTicketStatusHistoryRow {
  ticket_id: string; // UUID
  from_status: string | null; // VARCHAR(32)
  to_status: string; // VARCHAR(32)
  actor_user_id: string | null; // UUID
  reason: string | null; // TEXT
  id: string; // UUID
  created_at: Date; // TIMESTAMP WITH TIME ZONE
}
