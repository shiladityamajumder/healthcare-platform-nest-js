// * Describes the raw PostgreSQL row shape for the appointment.waiting_room_events table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `appointment.waiting_room_events`. */
export interface AppointmentWaitingRoomEventsRow {
  appointment_id: string; // UUID
  participant_type: string; // VARCHAR(32)
  event_type: string; // VARCHAR(32)
  metadata_json: unknown; // JSONB
  id: string; // UUID
  created_at: Date; // TIMESTAMP WITH TIME ZONE
}
