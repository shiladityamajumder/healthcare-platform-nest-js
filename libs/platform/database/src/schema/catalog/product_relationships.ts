// Linked with: database repositories, migrations, and transaction code.
// Used by: the package code that imports this component.
// Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `catalog.product_relationships`. */
// Describe the database row shape consumed by repositories and transaction code.
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
