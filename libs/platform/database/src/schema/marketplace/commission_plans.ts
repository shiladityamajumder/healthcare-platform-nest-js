/** Raw PostgreSQL row shape for `marketplace.commission_plans`. */
export interface MarketplaceCommissionPlansRow {
  code: string; // VARCHAR(64)
  name: string; // VARCHAR(128)
  calculation_type: string; // VARCHAR(32)
  rules: unknown; // JSONB
  valid_from: Date; // TIMESTAMP WITH TIME ZONE
  valid_until: Date | null; // TIMESTAMP WITH TIME ZONE
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
