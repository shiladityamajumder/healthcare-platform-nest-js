// * Linked with: database repositories, migrations, and transaction code.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `appointment.availability_exceptions`. */
// * Describe the database row shape consumed by repositories and transaction code.
export interface AppointmentAvailabilityExceptionsRow {
  practitioner_service_id: string; // UUID
  starts_at: Date; // TIMESTAMP WITH TIME ZONE
  ends_at: Date; // TIMESTAMP WITH TIME ZONE
  exception_type: string; // VARCHAR(32)
  capacity_override: number | null; // INTEGER
  reason: string | null; // VARCHAR(255)
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
