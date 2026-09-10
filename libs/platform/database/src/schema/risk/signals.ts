/** Raw PostgreSQL row shape for `risk.signals`. */
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
