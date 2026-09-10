// Linked with: database repositories, migrations, and transaction code.
// Used by: the package code that imports this component.
// Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `catalog.product_media`. */
// Describe the database row shape consumed by repositories and transaction code.
export interface CatalogProductMediaRow {
  product_id: string; // UUID
  variant_id: string | null; // UUID
  media_type: string; // VARCHAR(32)
  file_object_id: string; // UUID
  alt_text: string | null; // VARCHAR(255)
  display_order: number; // INTEGER
  is_primary: boolean; // BOOLEAN
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
