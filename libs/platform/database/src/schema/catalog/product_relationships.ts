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
