// Linked with: database repositories, migrations, and transaction code.
// Used by: the package code that imports this component.
// Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `clinical.patient_allergies`. */
// Describe the database row shape consumed by repositories and transaction code.
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
