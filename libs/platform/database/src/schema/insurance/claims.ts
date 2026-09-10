/** Raw PostgreSQL row shape for `insurance.claims`. */
export interface InsuranceClaimsRow {
  claim_number: string; // VARCHAR(64)
  policy_id: string; // UUID
  patient_profile_id: string; // UUID
  reference_type: string; // VARCHAR(32)
  reference_id: string; // UUID
  status: string; // VARCHAR(18)
  claimed_amount: string; // NUMERIC(18, 2)
  approved_amount: string | null; // NUMERIC(18, 2)
  currency: string; // VARCHAR(3)
  submitted_at: Date | null; // TIMESTAMP WITH TIME ZONE
  resolved_at: Date | null; // TIMESTAMP WITH TIME ZONE
  provider_claim_reference: string | null; // VARCHAR(255)
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
