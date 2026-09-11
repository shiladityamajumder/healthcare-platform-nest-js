// * Linked with: database repositories, migrations, and transaction code.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `clinical.practitioner_profiles`. */
// * Describe the database row shape consumed by repositories and transaction code.
export interface ClinicalPractitionerProfilesRow {
  user_id: string; // UUID
  practitioner_type: string; // VARCHAR(32)
  registration_number: string; // VARCHAR(128)
  registration_council: string; // VARCHAR(255)
  specialization: string | null; // VARCHAR(128)
  qualification: string | null; // VARCHAR(255)
  years_of_experience: number | null; // INTEGER
  hpr_id: string | null; // VARCHAR(128)
  verification_status: string; // VARCHAR(16)
  verified_at: Date | null; // TIMESTAMP WITH TIME ZONE
  profile_metadata: unknown; // JSONB
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
