// Linked with: database repositories, migrations, and transaction code.
// Used by: the package code that imports this component.
// Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `clinical.prescriptions`. */
// Describe the database row shape consumed by repositories and transaction code.
export interface ClinicalPrescriptionsRow {
  patient_profile_id: string; // UUID
  prescriber_user_id: string | null; // UUID
  uploaded_by_user_id: string; // UUID
  consultation_id: string | null; // UUID
  prescription_number: string | null; // VARCHAR(128)
  issued_at: Date | null; // TIMESTAMP WITH TIME ZONE
  valid_until: Date | null; // TIMESTAMP WITH TIME ZONE
  status: string; // VARCHAR(18)
  source: string; // VARCHAR(32)
  reviewed_by_user_id: string | null; // UUID
  reviewed_at: Date | null; // TIMESTAMP WITH TIME ZONE
  review_notes: string | null; // TEXT
  digital_signature: Buffer | null; // BYTEA
  signature_algorithm: string | null; // VARCHAR(64)
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
