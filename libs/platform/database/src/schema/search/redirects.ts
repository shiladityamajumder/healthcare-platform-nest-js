/** Raw PostgreSQL row shape for `search.redirects`. */
export interface SearchRedirectsRow {
  locale: string; // VARCHAR(16)
  query_normalized: string; // VARCHAR(255)
  destination_type: string; // VARCHAR(32)
  destination_value: string; // VARCHAR(512)
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
