// * Linked with: database repositories, migrations, and transaction code.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `clinical.practitioner_organizations`. */
// * Describe the database row shape consumed by repositories and transaction code.
export interface ClinicalPractitionerOrganizationsRow {
  practitioner_profile_id: string; // UUID
  organization_id: string; // UUID
  location_id: string | null; // UUID
  consultation_modes: unknown; // JSONB
  is_active: boolean; // BOOLEAN
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
