/** Raw PostgreSQL row shape for `insurance.policies`. */
export interface InsurancePoliciesRow {
  user_id: string; // UUID
  patient_profile_id: string | null; // UUID
  insurer_id: string; // UUID
  tpa_id: string | null; // UUID
  policy_number_hash: string; // VARCHAR(128)
  policy_number_encrypted: Buffer; // BYTEA
  plan_name: string | null; // VARCHAR(255)
  coverage_start: string; // DATE
  coverage_end: string; // DATE
  sum_insured: string | null; // NUMERIC(18, 2)
  status: string; // VARCHAR(32)
  policy_metadata: unknown; // JSONB
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
