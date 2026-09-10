// Linked with: database repositories, migrations, and transaction code.
// Used by: the package code that imports this component.
// Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `catalog.product_variants`. */
// Describe the database row shape consumed by repositories and transaction code.
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
