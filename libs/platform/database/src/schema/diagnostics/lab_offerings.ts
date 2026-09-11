// * Linked with: database repositories, migrations, and transaction code.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `diagnostics.lab_offerings`. */
// * Describe the database row shape consumed by repositories and transaction code.
export interface DiagnosticsLabOfferingsRow {
  lab_location_id: string; // UUID
  test_definition_id: string | null; // UUID
  test_package_id: string | null; // UUID
  provider_code: string | null; // VARCHAR(128)
  mrp: string; // NUMERIC(14, 2)
  selling_price: string; // NUMERIC(14, 2)
  home_collection_fee: string; // NUMERIC(14, 2)
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
