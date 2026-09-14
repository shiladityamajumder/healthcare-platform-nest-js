// * Describes the raw PostgreSQL row shape for the risk.signals table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `risk.signals`. */
export interface RiskSignalsRow {
  assessment_id: string | null; // UUID
  subject_type: string; // VARCHAR(64)
  subject_id: string; // UUID
  signal_code: string; // VARCHAR(128)
  signal_value: unknown; // JSONB
  source: string; // VARCHAR(64)
  id: string; // UUID
  created_at: Date; // TIMESTAMP WITH TIME ZONE
}
