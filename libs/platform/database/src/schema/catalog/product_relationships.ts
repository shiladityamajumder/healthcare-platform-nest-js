// * Describes the raw PostgreSQL row shape for the catalog.product_relationships table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `catalog.product_relationships`. */
export interface CatalogProductRelationshipsRow {
  source_product_id: string; // UUID
  target_product_id: string; // UUID
  relationship_type: string; // VARCHAR(32)
  priority: number; // INTEGER
  metadata_json: unknown; // JSONB
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
