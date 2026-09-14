// * Describes the raw PostgreSQL row shape for the compliance.adverse_event_reports table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `compliance.adverse_event_reports`. */
export interface ComplianceAdverseEventReportsRow {
  report_number: string; // VARCHAR(64)
  patient_profile_id: string | null; // UUID
  product_id: string | null; // UUID
  prescription_id: string | null; // UUID
  reported_by_user_id: string | null; // UUID
  event_description_encrypted: Buffer; // BYTEA
  seriousness: string; // VARCHAR(32)
  outcome: string | null; // VARCHAR(64)
  status: string; // VARCHAR(32)
  occurred_at: Date | null; // TIMESTAMP WITH TIME ZONE
  reported_at: Date; // TIMESTAMP WITH TIME ZONE
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
