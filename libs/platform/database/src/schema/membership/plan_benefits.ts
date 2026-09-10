/** Raw PostgreSQL row shape for `membership.plan_benefits`. */
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
