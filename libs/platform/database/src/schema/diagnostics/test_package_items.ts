/** Raw PostgreSQL row shape for `diagnostics.test_package_items`. */
export interface DiagnosticsTestPackageItemsRow {
  package_id: string; // UUID
  test_definition_id: string; // UUID
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
