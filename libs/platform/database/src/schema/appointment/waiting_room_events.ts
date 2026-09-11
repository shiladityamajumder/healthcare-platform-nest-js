// * Linked with: database repositories, migrations, and transaction code.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `appointment.waiting_room_events`. */
// * Describe the database row shape consumed by repositories and transaction code.
export interface AppointmentWaitingRoomEventsRow {
  appointment_id: string; // UUID
  participant_type: string; // VARCHAR(32)
  event_type: string; // VARCHAR(32)
  metadata_json: unknown; // JSONB
  id: string; // UUID
  created_at: Date; // TIMESTAMP WITH TIME ZONE
}
