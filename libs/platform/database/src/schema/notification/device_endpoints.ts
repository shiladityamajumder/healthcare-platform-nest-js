// * Describes the raw PostgreSQL row shape for the notification.device_endpoints table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `notification.device_endpoints`. */
export interface NotificationDeviceEndpointsRow {
  user_id: string; // UUID
  device_id: string; // VARCHAR(255)
  platform: string; // VARCHAR(32)
  provider: string; // VARCHAR(64)
  token_encrypted: Buffer; // BYTEA
  token_hash: string; // VARCHAR(128)
  locale: string | null; // VARCHAR(16)
  timezone: string | null; // VARCHAR(64)
  enabled: boolean; // BOOLEAN
  last_seen_at: Date | null; // TIMESTAMP WITH TIME ZONE
  invalidated_at: Date | null; // TIMESTAMP WITH TIME ZONE
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
