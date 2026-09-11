// * Linked with: database repositories, migrations, and transaction code.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `insurance.policy_members`. */
// * Describe the database row shape consumed by repositories and transaction code.
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
