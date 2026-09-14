// * Describes the raw PostgreSQL row shape for the compliance.privacy_requests table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `compliance.privacy_requests`. */
export interface CompliancePrivacyRequestsRow {
  request_number: string; // VARCHAR(64)
  user_id: string; // UUID
  request_type: string; // VARCHAR(64)
  status: string; // VARCHAR(32)
  requested_at: Date; // TIMESTAMP WITH TIME ZONE
  due_at: Date | null; // TIMESTAMP WITH TIME ZONE
  completed_at: Date | null; // TIMESTAMP WITH TIME ZONE
  resolution_notes: string | null; // TEXT
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
