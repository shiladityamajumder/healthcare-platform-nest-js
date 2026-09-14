// * Describes the raw PostgreSQL row shape for the clinical.patient_conditions table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `clinical.patient_conditions`. */
export interface ClinicalPatientConditionsRow {
  patient_profile_id: string; // UUID
  condition_code: string | null; // VARCHAR(128)
  condition_name: string; // VARCHAR(255)
  clinical_status: string; // VARCHAR(32)
  onset_date: string | null; // DATE
  resolved_date: string | null; // DATE
  notes: string | null; // TEXT
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  is_deleted: boolean; // BOOLEAN
  deleted_at: Date | null; // TIMESTAMP WITH TIME ZONE
  deleted_by: string | null; // UUID
  row_version: string; // BIGINT
}
