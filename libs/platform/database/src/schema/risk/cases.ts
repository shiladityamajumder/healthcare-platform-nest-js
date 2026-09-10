/** Raw PostgreSQL row shape for `risk.cases`. */
export interface RiskCasesRow {
  case_number: string; // VARCHAR(64)
  subject_type: string; // VARCHAR(64)
  subject_id: string; // UUID
  assessment_id: string | null; // UUID
  status: string; // VARCHAR(32)
  priority: string; // VARCHAR(16)
  assigned_to_user_id: string | null; // UUID
  resolution: string | null; // VARCHAR(64)
  resolution_notes: string | null; // TEXT
  resolved_at: Date | null; // TIMESTAMP WITH TIME ZONE
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
