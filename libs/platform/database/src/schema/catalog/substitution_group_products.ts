/** Raw PostgreSQL row shape for `catalog.substitution_group_products`. */
export interface CatalogSubstitutionGroupProductsRow {
  group_id: string; // UUID
  product_id: string; // UUID
  priority: number; // INTEGER
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
