// * Linked with: database repositories, migrations, and transaction code.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `appointment.practitioner_services`. */
// * Describe the database row shape consumed by repositories and transaction code.
export interface AppointmentPractitionerServicesRow {
  practitioner_profile_id: string; // UUID
  service_type_id: string; // UUID
  organization_id: string | null; // UUID
  location_id: string | null; // UUID
  fee: string; // NUMERIC(14, 2)
  currency: string; // VARCHAR(3)
  duration_minutes: number; // INTEGER
  buffer_minutes: number; // INTEGER
  is_active: boolean; // BOOLEAN
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
