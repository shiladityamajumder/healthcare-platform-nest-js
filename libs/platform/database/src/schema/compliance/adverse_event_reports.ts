// * Linked with: database repositories, migrations, and transaction code.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `compliance.adverse_event_reports`. */
// * Describe the database row shape consumed by repositories and transaction code.
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
