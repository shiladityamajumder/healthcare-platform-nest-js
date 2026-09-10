/** Raw PostgreSQL row shape for `notification.suppressions`. */
export interface NotificationSuppressionsRow {
  channel: string; // VARCHAR(32)
  destination_hash: string; // VARCHAR(128)
  reason: string; // VARCHAR(64)
  expires_at: Date | null; // TIMESTAMP WITH TIME ZONE
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
