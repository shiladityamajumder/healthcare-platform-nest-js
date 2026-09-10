/** Raw PostgreSQL row shape for `appointment.service_types`. */
export interface AppointmentServiceTypesRow {
  code: string; // VARCHAR(64)
  name: string; // VARCHAR(128)
  service_mode: string; // VARCHAR(32)
  default_duration_minutes: number; // INTEGER
  requires_payment: boolean; // BOOLEAN
  requires_prescription: boolean; // BOOLEAN
  is_active: boolean; // BOOLEAN
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
