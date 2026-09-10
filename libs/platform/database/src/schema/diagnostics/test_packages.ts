/** Raw PostgreSQL row shape for `diagnostics.test_packages`. */
export interface DiagnosticsTestPackagesRow {
  code: string; // VARCHAR(64)
  name: string; // VARCHAR(255)
  description: string | null; // TEXT
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
