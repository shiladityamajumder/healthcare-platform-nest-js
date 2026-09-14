// * Describes the raw PostgreSQL row shape for the clinical.patient_allergies table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `clinical.patient_allergies`. */
export interface ClinicalPatientAllergiesRow {
  patient_profile_id: string; // UUID
  substance_code: string | null; // VARCHAR(128)
  substance_name: string; // VARCHAR(255)
  allergy_type: string | null; // VARCHAR(64)
  reaction: string | null; // TEXT
  severity: string | null; // VARCHAR(32)
  recorded_at: Date; // TIMESTAMP WITH TIME ZONE
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
