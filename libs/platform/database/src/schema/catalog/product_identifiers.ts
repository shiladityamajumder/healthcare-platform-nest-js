// * Describes the raw PostgreSQL row shape for the catalog.product_identifiers table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `catalog.product_identifiers`. */
export interface CatalogProductIdentifiersRow {
  product_id: string | null; // UUID
  variant_id: string | null; // UUID
  identifier_type: string; // VARCHAR(32)
  identifier_value: string; // VARCHAR(128)
  is_primary: boolean; // BOOLEAN
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
