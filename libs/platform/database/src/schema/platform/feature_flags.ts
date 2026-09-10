/** Raw PostgreSQL row shape for `platform.feature_flags`. */
export interface PlatformFeatureFlagsRow {
  key: string; // VARCHAR(128)
  description: string | null; // TEXT
  enabled: boolean; // BOOLEAN
  rules: unknown; // JSONB
  rollout_percentage: number; // INTEGER
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
