// * Linked with: database repositories, migrations, and transaction code.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `diagnostics.test_definitions`. */
// * Describe the database row shape consumed by repositories and transaction code.
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
