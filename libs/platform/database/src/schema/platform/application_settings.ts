/** Raw PostgreSQL row shape for `platform.application_settings`. */
export interface PlatformApplicationSettingsRow {
  namespace: string; // VARCHAR(128)
  key: string; // VARCHAR(128)
  value: unknown; // JSONB
  is_secret_reference: boolean; // BOOLEAN
  description: string | null; // TEXT
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
