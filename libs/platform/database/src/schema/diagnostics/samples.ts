// * Describes the raw PostgreSQL row shape for the diagnostics.samples table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `diagnostics.samples`. */
export interface DiagnosticsSamplesRow {
  diagnostic_order_id: string; // UUID
  collection_id: string | null; // UUID
  barcode: string; // VARCHAR(128)
  sample_type: string; // VARCHAR(64)
  status: string; // VARCHAR(16)
  collected_at: Date | null; // TIMESTAMP WITH TIME ZONE
  received_at: Date | null; // TIMESTAMP WITH TIME ZONE
  rejected_reason: string | null; // VARCHAR(255)
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
