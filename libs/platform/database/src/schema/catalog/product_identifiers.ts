// Linked with: database repositories, migrations, and transaction code.
// Used by: the package code that imports this component.
// Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `catalog.product_identifiers`. */
// Describe the database row shape consumed by repositories and transaction code.
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
