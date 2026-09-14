// * Describes the raw PostgreSQL row shape for the diagnostics.diagnostic_orders table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `diagnostics.diagnostic_orders`. */
export interface DiagnosticsDiagnosticOrdersRow {
  order_number: string; // VARCHAR(64)
  user_id: string; // UUID
  patient_profile_id: string; // UUID
  lab_location_id: string; // UUID
  address_id: string | null; // UUID
  status: string; // VARCHAR(20)
  collection_type: string; // VARCHAR(32)
  scheduled_start: Date | null; // TIMESTAMP WITH TIME ZONE
  scheduled_end: Date | null; // TIMESTAMP WITH TIME ZONE
  currency: string; // VARCHAR(3)
  subtotal: string; // NUMERIC(16, 2)
  discount_total: string; // NUMERIC(16, 2)
  tax_total: string; // NUMERIC(16, 2)
  collection_fee: string; // NUMERIC(16, 2)
  grand_total: string; // NUMERIC(16, 2)
  payment_status: string; // VARCHAR(32)
  address_snapshot: unknown; // JSONB
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
