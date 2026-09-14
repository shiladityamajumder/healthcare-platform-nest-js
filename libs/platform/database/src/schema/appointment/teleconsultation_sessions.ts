// * Describes the raw PostgreSQL row shape for the appointment.teleconsultation_sessions table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `appointment.teleconsultation_sessions`. */
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
