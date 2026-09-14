// * Describes the raw PostgreSQL row shape for the clinical.diagnoses table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `clinical.diagnoses`. */
export interface ClinicalDiagnosesRow {
  consultation_id: string; // UUID
  code_system: string | null; // VARCHAR(64)
  code: string | null; // VARCHAR(64)
  display: string; // VARCHAR(255)
  diagnosis_type: string; // VARCHAR(32)
  notes: string | null; // TEXT
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
