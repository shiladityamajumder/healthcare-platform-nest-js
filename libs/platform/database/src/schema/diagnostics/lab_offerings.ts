// * Describes the raw PostgreSQL row shape for the diagnostics.lab_offerings table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `diagnostics.lab_offerings`. */
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
