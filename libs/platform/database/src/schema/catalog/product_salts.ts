/** Raw PostgreSQL row shape for `catalog.product_salts`. */
export interface CatalogProductSaltsRow {
  product_id: string; // UUID
  salt_id: string; // UUID
  strength: string | null; // VARCHAR(128)
  sequence: number; // SMALLINT
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
