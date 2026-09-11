// * Linked with: database repositories, migrations, and transaction code.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `notification.in_app_notifications`. */
// * Describe the database row shape consumed by repositories and transaction code.
export interface NotificationInAppNotificationsRow {
  user_id: string; // UUID
  notification_type: string; // VARCHAR(64)
  title: string; // VARCHAR(255)
  body: string; // TEXT
  data: unknown; // JSONB
  action_url: string | null; // VARCHAR(2048)
  image_file_id: string | null; // UUID
  idempotency_key: string; // VARCHAR(128)
  read_at: Date | null; // TIMESTAMP WITH TIME ZONE
  archived_at: Date | null; // TIMESTAMP WITH TIME ZONE
  expires_at: Date | null; // TIMESTAMP WITH TIME ZONE
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
