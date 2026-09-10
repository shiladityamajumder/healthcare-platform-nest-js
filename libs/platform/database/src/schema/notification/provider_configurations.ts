/** Raw PostgreSQL row shape for `notification.provider_configurations`. */
export interface NotificationProviderConfigurationsRow {
  provider: string; // VARCHAR(64)
  channel: string; // VARCHAR(32)
  account_code: string; // VARCHAR(64)
  credentials_secret_ref: string; // VARCHAR(255)
  configuration: unknown; // JSONB
  status: string; // VARCHAR(32)
  priority: number; // INTEGER
  is_default: boolean; // BOOLEAN
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
