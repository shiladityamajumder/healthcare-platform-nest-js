// * Describes the raw PostgreSQL row shape for the catalog.manufacturers table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `catalog.manufacturers`. */
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
