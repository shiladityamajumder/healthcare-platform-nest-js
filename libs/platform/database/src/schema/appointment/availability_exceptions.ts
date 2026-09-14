// * Describes the raw PostgreSQL row shape for the appointment.availability_exceptions table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `appointment.availability_exceptions`. */
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
