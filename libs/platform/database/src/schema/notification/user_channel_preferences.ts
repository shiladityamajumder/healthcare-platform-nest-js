// * Describes the raw PostgreSQL row shape for the notification.user_channel_preferences table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `notification.user_channel_preferences`. */
export interface NotificationUserChannelPreferencesRow {
  user_id: string; // UUID
  channel: string; // VARCHAR(32)
  notification_type: string; // VARCHAR(64)
  enabled: boolean; // BOOLEAN
  quiet_hours: unknown; // JSONB
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
