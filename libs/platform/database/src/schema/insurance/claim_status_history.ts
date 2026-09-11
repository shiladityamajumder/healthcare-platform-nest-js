// * Linked with: database repositories, migrations, and transaction code.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `insurance.claim_status_history`. */
// * Describe the database row shape consumed by repositories and transaction code.
export interface InsuranceClaimStatusHistoryRow {
  claim_id: string; // UUID
  from_status: string | null; // VARCHAR(32)
  to_status: string; // VARCHAR(32)
  reason_code: string | null; // VARCHAR(64)
  notes: string | null; // TEXT
  id: string; // UUID
  created_at: Date; // TIMESTAMP WITH TIME ZONE
}
