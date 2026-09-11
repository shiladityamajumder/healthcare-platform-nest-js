// * Linked with: database repositories, migrations, and transaction code.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `appointment.teleconsultation_sessions`. */
// * Describe the database row shape consumed by repositories and transaction code.
export interface AppointmentTeleconsultationSessionsRow {
  appointment_id: string; // UUID
  provider: string; // VARCHAR(64)
  provider_session_id: string; // VARCHAR(255)
  join_url_encrypted: Buffer | null; // BYTEA
  started_at: Date | null; // TIMESTAMP WITH TIME ZONE
  ended_at: Date | null; // TIMESTAMP WITH TIME ZONE
  status: string; // VARCHAR(32)
  recording_file_id: string | null; // UUID
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
