/** Raw PostgreSQL row shape for `catalog.categories`. */
export interface CatalogCategoriesRow {
  parent_id: string | null; // UUID
  name: string; // VARCHAR(255)
  slug: string; // VARCHAR(255)
  path: string; // VARCHAR(1024)
  level: number; // SMALLINT
  display_order: number; // INTEGER
  is_active: boolean; // BOOLEAN
  metadata_json: unknown; // JSONB
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
