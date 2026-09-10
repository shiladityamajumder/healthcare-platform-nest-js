// Linked with: database repositories, migrations, and transaction code.
// Used by: the package code that imports this component.
// Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `appointment.availability_rules`. */
// Describe the database row shape consumed by repositories and transaction code.
export interface AppointmentAvailabilityRulesRow {
  practitioner_service_id: string; // UUID
  day_of_week: number; // INTEGER
  start_local_time: string; // VARCHAR(8)
  end_local_time: string; // VARCHAR(8)
  timezone: string; // VARCHAR(64)
  slot_capacity: number; // INTEGER
  valid_from: Date | null; // TIMESTAMP WITH TIME ZONE
  valid_until: Date | null; // TIMESTAMP WITH TIME ZONE
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
