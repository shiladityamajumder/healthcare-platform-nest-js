// * Describes the raw PostgreSQL row shape for the insurance.claim_status_history table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `insurance.claim_status_history`. */
export interface InsuranceClaimStatusHistoryRow {
  claim_id: string; // UUID
  from_status: string | null; // VARCHAR(32)
  to_status: string; // VARCHAR(32)
  reason_code: string | null; // VARCHAR(64)
  notes: string | null; // TEXT
  id: string; // UUID
  created_at: Date; // TIMESTAMP WITH TIME ZONE
}
