/** Raw PostgreSQL row shape for `diagnostics.diagnostic_order_items`. */
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
