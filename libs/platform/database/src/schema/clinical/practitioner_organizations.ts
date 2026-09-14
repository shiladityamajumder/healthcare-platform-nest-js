// * Describes the raw PostgreSQL row shape for the clinical.practitioner_organizations table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `clinical.practitioner_organizations`. */
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
