/** Raw PostgreSQL row shape for `notification.message_attachments`. */
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
