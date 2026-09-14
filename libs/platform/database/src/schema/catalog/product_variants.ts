// * Describes the raw PostgreSQL row shape for the catalog.product_variants table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `catalog.product_variants`. */
export interface CatalogProductVariantsRow {
  product_id: string; // UUID
  variant_sku: string; // VARCHAR(64)
  name: string; // VARCHAR(255)
  strength_display: string | null; // VARCHAR(128)
  pack_quantity: string; // NUMERIC(12, 3)
  pack_uom_id: string | null; // UUID
  status: string; // VARCHAR(16)
  is_default: boolean; // BOOLEAN
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
