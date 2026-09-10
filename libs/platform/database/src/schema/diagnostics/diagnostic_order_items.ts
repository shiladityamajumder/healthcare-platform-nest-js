// Linked with: database repositories, migrations, and transaction code.
// Used by: the package code that imports this component.
// Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `diagnostics.diagnostic_order_items`. */
// Describe the database row shape consumed by repositories and transaction code.
export interface DiagnosticsDiagnosticOrderItemsRow {
  diagnostic_order_id: string; // UUID
  test_definition_id: string | null; // UUID
  test_package_id: string | null; // UUID
  offering_id: string | null; // UUID
  item_snapshot: unknown; // JSONB
  unit_price: string; // NUMERIC(14, 2)
  discount_amount: string; // NUMERIC(14, 2)
  tax_amount: string; // NUMERIC(14, 2)
  line_total: string; // NUMERIC(16, 2)
  status: string; // VARCHAR(32)
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
