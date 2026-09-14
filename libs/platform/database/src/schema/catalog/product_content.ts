// * Describes the raw PostgreSQL row shape for the catalog.product_content table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `catalog.product_content`. */
export interface CatalogProductContentRow {
  product_id: string; // UUID
  locale: string; // VARCHAR(16)
  content_type: string; // VARCHAR(64)
  title: string | null; // VARCHAR(255)
  body: string; // TEXT
  structured_content: unknown; // JSONB
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
