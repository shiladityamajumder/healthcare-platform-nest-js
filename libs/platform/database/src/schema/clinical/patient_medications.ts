// * Describes the raw PostgreSQL row shape for the clinical.patient_medications table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `clinical.patient_medications`. */
export interface ClinicalPatientMedicationsRow {
  patient_profile_id: string; // UUID
  product_id: string | null; // UUID
  medicine_name: string; // VARCHAR(255)
  dosage: string | null; // VARCHAR(128)
  frequency: string | null; // VARCHAR(128)
  started_at: string | null; // DATE
  ended_at: string | null; // DATE
  source: string; // VARCHAR(32)
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
