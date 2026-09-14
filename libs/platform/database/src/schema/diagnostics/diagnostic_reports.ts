// * Describes the raw PostgreSQL row shape for the diagnostics.diagnostic_reports table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `diagnostics.diagnostic_reports`. */
export interface DiagnosticsDiagnosticReportsRow {
  diagnostic_order_id: string; // UUID
  version_no: number; // INTEGER
  status: string; // VARCHAR(32)
  file_object_id: string | null; // UUID
  structured_result: unknown; // JSONB
  verified_by_user_id: string | null; // UUID
  verified_at: Date | null; // TIMESTAMP WITH TIME ZONE
  released_at: Date | null; // TIMESTAMP WITH TIME ZONE
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
