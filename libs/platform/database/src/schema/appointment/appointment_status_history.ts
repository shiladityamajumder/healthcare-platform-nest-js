/** Raw PostgreSQL row shape for `appointment.appointment_status_history`. */
export interface AppointmentAppointmentStatusHistoryRow {
  appointment_id: string; // UUID
  from_status: string | null; // VARCHAR(32)
  to_status: string; // VARCHAR(32)
  actor_user_id: string | null; // UUID
  reason_code: string | null; // VARCHAR(64)
  comment: string | null; // TEXT
  id: string; // UUID
  created_at: Date; // TIMESTAMP WITH TIME ZONE
}
