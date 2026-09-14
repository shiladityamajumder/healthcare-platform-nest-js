// * Describes the raw PostgreSQL row shape for the insurance.policy_members table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `insurance.policy_members`. */
export interface InsurancePolicyMembersRow {
  policy_id: string; // UUID
  patient_profile_id: string; // UUID
  member_id_hash: string | null; // VARCHAR(128)
  relationship: string | null; // VARCHAR(64)
  coverage_metadata: unknown; // JSONB
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
