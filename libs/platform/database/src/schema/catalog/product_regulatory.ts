// Linked with: database repositories, migrations, and transaction code.
// Used by: the package code that imports this component.
// Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `catalog.product_regulatory`. */
// Describe the database row shape consumed by repositories and transaction code.
export interface CatalogProductRegulatoryRow {
  product_id: string; // UUID
  drug_license_category: string | null; // VARCHAR(64)
  storage_conditions: string | null; // TEXT
  controlled_substance: boolean; // BOOLEAN
  max_order_quantity: string | null; // NUMERIC(12, 3)
  requires_cold_chain: boolean; // BOOLEAN
  requires_age_verification: boolean; // BOOLEAN
  narcotic_register_required: boolean; // BOOLEAN
  regulatory_metadata: unknown; // JSONB
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
