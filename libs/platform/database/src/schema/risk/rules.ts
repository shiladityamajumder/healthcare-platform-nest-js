/** Raw PostgreSQL row shape for `risk.rules`. */
export interface RiskRulesRow {
  code: string; // VARCHAR(64)
  name: string; // VARCHAR(255)
  scope: string; // VARCHAR(64)
  rule_definition: unknown; // JSONB
  action: string; // VARCHAR(16)
  priority: number; // INTEGER
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
