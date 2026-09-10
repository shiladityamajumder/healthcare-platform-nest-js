/** Raw PostgreSQL row shape for `insurance.eligibility_checks`. */
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
