// * Linked with: database repositories, migrations, and transaction code.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `insurance.eligibility_checks`. */
// * Describe the database row shape consumed by repositories and transaction code.
export interface InsuranceEligibilityChecksRow {
  policy_id: string; // UUID
  reference_type: string; // VARCHAR(32)
  reference_id: string; // UUID
  eligible: boolean; // BOOLEAN
  response_payload: unknown; // JSONB
  provider_reference: string | null; // VARCHAR(255)
  id: string; // UUID
  created_at: Date; // TIMESTAMP WITH TIME ZONE
}
