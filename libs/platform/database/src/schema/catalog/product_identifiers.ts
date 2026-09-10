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
