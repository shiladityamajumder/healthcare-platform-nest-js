// * Linked with: database repositories, migrations, and transaction code.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `membership.plan_benefits`. */
// * Describe the database row shape consumed by repositories and transaction code.
export interface MembershipPlanBenefitsRow {
  plan_id: string; // UUID
  benefit_code: string; // VARCHAR(64)
  benefit_type: string; // VARCHAR(32)
  rules: unknown; // JSONB
  usage_limit: number | null; // INTEGER
  is_active: boolean; // BOOLEAN
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
