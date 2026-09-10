/** Raw PostgreSQL row shape for `diagnostics.lab_providers`. */
export interface DiagnosticsLabProvidersRow {
  organization_id: string; // UUID
  code: string; // VARCHAR(64)
  name: string; // VARCHAR(255)
  verification_status: string; // VARCHAR(16)
  integration_type: string; // VARCHAR(32)
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
