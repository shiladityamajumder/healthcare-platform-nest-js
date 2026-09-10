// Linked with: database repositories, migrations, and transaction code.
// Used by: the package code that imports this component.
// Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `notification.templates`. */
// Describe the database row shape consumed by repositories and transaction code.
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
