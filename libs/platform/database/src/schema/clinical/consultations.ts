// Linked with: database repositories, migrations, and transaction code.
// Used by: the package code that imports this component.
// Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `clinical.consultations`. */
// Describe the database row shape consumed by repositories and transaction code.
export interface ClinicalConsultationsRow {
  patient_profile_id: string; // UUID
  doctor_user_id: string; // UUID
  practitioner_profile_id: string | null; // UUID
  appointment_id: string | null; // UUID
  care_episode_id: string | null; // UUID
  consultation_type: string; // VARCHAR(32)
  status: string; // VARCHAR(16)
  started_at: Date | null; // TIMESTAMP WITH TIME ZONE
  ended_at: Date | null; // TIMESTAMP WITH TIME ZONE
  chief_complaint: string | null; // TEXT
  clinical_notes_encrypted: Buffer | null; // BYTEA
  encryption_key_version: string | null; // VARCHAR(64)
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
