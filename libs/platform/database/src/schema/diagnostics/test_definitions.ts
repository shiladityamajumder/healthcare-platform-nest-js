/** Raw PostgreSQL row shape for `diagnostics.test_definitions`. */
export interface DiagnosticsTestDefinitionsRow {
  code: string; // VARCHAR(64)
  name: string; // VARCHAR(255)
  test_type: string; // VARCHAR(32)
  sample_type: string | null; // VARCHAR(64)
  fasting_required: boolean; // BOOLEAN
  preparation_instructions: string | null; // TEXT
  turnaround_minutes: number | null; // INTEGER
  report_schema: unknown; // JSONB
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
