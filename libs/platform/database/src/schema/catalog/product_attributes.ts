// Linked with: database repositories, migrations, and transaction code.
// Used by: the package code that imports this component.
// Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `catalog.product_attributes`. */
// Describe the database row shape consumed by repositories and transaction code.
export interface CatalogProductAttributesRow {
  product_id: string; // UUID
  attribute_key: string; // VARCHAR(128)
  attribute_value: unknown; // JSONB
  is_filterable: boolean; // BOOLEAN
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
