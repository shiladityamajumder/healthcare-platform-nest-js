// * Linked with: database repositories, migrations, and transaction code.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `clinical.prescription_access_logs`. */
// * Describe the database row shape consumed by repositories and transaction code.
export interface ClinicalPrescriptionAccessLogsRow {
  prescription_id: string; // UUID
  actor_user_id: string | null; // UUID
  action: string; // VARCHAR(32)
  purpose: string; // VARCHAR(128)
  ip_address: string | null; // INET
  request_id: string; // UUID
  occurred_at: Date; // TIMESTAMP WITH TIME ZONE
  id: string; // UUID
  created_at: Date; // TIMESTAMP WITH TIME ZONE
}
