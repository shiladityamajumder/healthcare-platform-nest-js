// * Describes the raw PostgreSQL row shape for the compliance.legal_holds table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `compliance.legal_holds`. */
export interface ComplianceLegalHoldsRow {
  hold_number: string; // VARCHAR(64)
  reason: string; // TEXT
  scope: unknown; // JSONB
  status: string; // VARCHAR(32)
  effective_at: Date; // TIMESTAMP WITH TIME ZONE
  released_at: Date | null; // TIMESTAMP WITH TIME ZONE
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
