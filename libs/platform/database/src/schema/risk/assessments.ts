// * Describes the raw PostgreSQL row shape for the risk.assessments table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `risk.assessments`. */
export interface RiskAssessmentsRow {
  subject_type: string; // VARCHAR(64)
  subject_id: string; // UUID
  user_id: string | null; // UUID
  score: string; // NUMERIC(10, 4)
  decision: string; // VARCHAR(16)
  model_version: string; // VARCHAR(64)
  reasons: unknown; // JSONB
  request_id: string | null; // UUID
  id: string; // UUID
  created_at: Date; // TIMESTAMP WITH TIME ZONE
}
