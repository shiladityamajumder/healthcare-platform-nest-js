// Linked with: database repositories, migrations, and transaction code.
// Used by: the package code that imports this component.
// Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `notification.message_attachments`. */
// Describe the database row shape consumed by repositories and transaction code.
export interface NotificationMessageAttachmentsRow {
  message_id: string; // UUID
  file_object_id: string; // UUID
  disposition: string; // VARCHAR(16)
  filename: string | null; // VARCHAR(255)
  content_id: string | null; // VARCHAR(255)
  display_order: number; // INTEGER
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
