// * Linked with: database repositories, migrations, and transaction code.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `catalog.manufacturers`. */
// * Describe the database row shape consumed by repositories and transaction code.
export interface CatalogManufacturersRow {
  organization_id: string | null; // UUID
  name: string; // VARCHAR(255)
  legal_name: string | null; // VARCHAR(255)
  license_number: string | null; // VARCHAR(128)
  country_code: string; // VARCHAR(2)
  is_active: boolean; // BOOLEAN
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
