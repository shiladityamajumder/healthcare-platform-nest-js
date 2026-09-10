/** Raw PostgreSQL row shape for `appointment.appointment_slots`. */
export interface AppointmentAppointmentSlotsRow {
  practitioner_service_id: string; // UUID
  starts_at: Date; // TIMESTAMP WITH TIME ZONE
  ends_at: Date; // TIMESTAMP WITH TIME ZONE
  capacity: number; // INTEGER
  booked_count: number; // INTEGER
  status: string; // VARCHAR(32)
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
