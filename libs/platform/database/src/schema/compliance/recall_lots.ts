// * Describes the raw PostgreSQL row shape for the compliance.recall_lots table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `compliance.recall_lots`. */
export interface ComplianceRecallLotsRow {
  recall_id: string; // UUID
  lot_id: string; // UUID
  affected_quantity: string | null; // VARCHAR(64)
  action_status: string; // VARCHAR(32)
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
