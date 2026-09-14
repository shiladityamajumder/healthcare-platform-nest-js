// * Describes the raw PostgreSQL row shape for the clinical.prescription_access_logs table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `clinical.prescription_access_logs`. */
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
