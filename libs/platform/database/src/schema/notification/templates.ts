// * Describes the raw PostgreSQL row shape for the notification.templates table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `notification.templates`. */
export interface NotificationTemplatesRow {
  code: string; // VARCHAR(128)
  channel: string; // VARCHAR(32)
  locale: string; // VARCHAR(16)
  subject_template: string | null; // TEXT
  body_template: string; // TEXT
  variables_schema: unknown; // JSONB
  version: number; // INTEGER
  status: string; // VARCHAR(32)
  provider_template_id: string | null; // VARCHAR(255)
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
