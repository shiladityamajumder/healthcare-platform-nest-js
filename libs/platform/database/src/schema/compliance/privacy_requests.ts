// * Linked with: database repositories, migrations, and transaction code.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `compliance.privacy_requests`. */
// * Describe the database row shape consumed by repositories and transaction code.
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
