// Linked with: database repositories, migrations, and transaction code.
// Used by: the package code that imports this component.
// Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `risk.assessments`. */
// Describe the database row shape consumed by repositories and transaction code.
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
