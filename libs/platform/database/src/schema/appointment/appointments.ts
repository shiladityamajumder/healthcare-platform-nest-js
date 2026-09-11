// * Linked with: database repositories, migrations, and transaction code.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `appointment.appointments`. */
// * Describe the database row shape consumed by repositories and transaction code.
export interface AppointmentAppointmentsRow {
  appointment_number: string; // VARCHAR(64)
  patient_profile_id: string; // UUID
  practitioner_profile_id: string; // UUID
  practitioner_service_id: string; // UUID
  slot_id: string | null; // UUID
  booked_by_user_id: string; // UUID
  scheduled_start: Date; // TIMESTAMP WITH TIME ZONE
  scheduled_end: Date; // TIMESTAMP WITH TIME ZONE
  status: string; // VARCHAR(16)
  reason_for_visit: string | null; // TEXT
  payment_status: string; // VARCHAR(32)
  source: string; // VARCHAR(32)
  metadata_json: unknown; // JSONB
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
