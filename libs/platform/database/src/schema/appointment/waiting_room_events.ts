/** Raw PostgreSQL row shape for `appointment.waiting_room_events`. */
export interface AppointmentWaitingRoomEventsRow {
  appointment_id: string; // UUID
  participant_type: string; // VARCHAR(32)
  event_type: string; // VARCHAR(32)
  metadata_json: unknown; // JSONB
  id: string; // UUID
  created_at: Date; // TIMESTAMP WITH TIME ZONE
}
