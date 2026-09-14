// * Describes the raw PostgreSQL row shape for the catalog.product_attributes table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `catalog.product_attributes`. */
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
