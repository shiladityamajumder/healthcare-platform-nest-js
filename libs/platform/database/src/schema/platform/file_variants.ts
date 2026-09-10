/** Raw PostgreSQL row shape for `platform.file_variants`. */
export interface PlatformFileVariantsRow {
  source_file_id: string; // UUID
  variant_file_id: string; // UUID
  variant_name: string; // VARCHAR(64)
  transformation: unknown; // JSONB
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
