/** Raw PostgreSQL row shape for `platform.data_retention_policies`. */
export interface PlatformDataRetentionPoliciesRow {
  data_category: string; // VARCHAR(128)
  retention_days: number; // INTEGER
  legal_basis: string; // VARCHAR(255)
  delete_strategy: string; // VARCHAR(64)
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
