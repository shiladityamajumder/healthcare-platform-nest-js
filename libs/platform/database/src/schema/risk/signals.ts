// Linked with: database repositories, migrations, and transaction code.
// Used by: the package code that imports this component.
// Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `risk.signals`. */
// Describe the database row shape consumed by repositories and transaction code.
export interface RiskSignalsRow {
  assessment_id: string | null; // UUID
  subject_type: string; // VARCHAR(64)
  subject_id: string; // UUID
  signal_code: string; // VARCHAR(128)
  signal_value: unknown; // JSONB
  source: string; // VARCHAR(64)
  id: string; // UUID
  created_at: Date; // TIMESTAMP WITH TIME ZONE
}
