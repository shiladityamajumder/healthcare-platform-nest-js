/** Raw PostgreSQL row shape for `support.tickets`. */
export interface SupportTicketsRow {
  ticket_number: string; // VARCHAR(64)
  user_id: string | null; // UUID
  order_id: string | null; // UUID
  diagnostic_order_id: string | null; // UUID
  appointment_id: string | null; // UUID
  category: string; // VARCHAR(64)
  subcategory: string | null; // VARCHAR(64)
  priority: string; // VARCHAR(16)
  status: string; // VARCHAR(16)
  subject: string; // VARCHAR(255)
  description: string; // TEXT
  assigned_to_user_id: string | null; // UUID
  assigned_team: string | null; // VARCHAR(64)
  sla_policy_id: string | null; // UUID
  first_response_due_at: Date | null; // TIMESTAMP WITH TIME ZONE
  resolution_due_at: Date | null; // TIMESTAMP WITH TIME ZONE
  first_responded_at: Date | null; // TIMESTAMP WITH TIME ZONE
  resolved_at: Date | null; // TIMESTAMP WITH TIME ZONE
  closed_at: Date | null; // TIMESTAMP WITH TIME ZONE
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
