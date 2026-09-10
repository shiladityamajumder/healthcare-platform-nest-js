// Linked with: database repositories, migrations, and transaction code.
// Used by: the package code that imports this component.
// Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `diagnostics.diagnostic_result_values`. */
// Describe the database row shape consumed by repositories and transaction code.
export interface DiagnosticsDiagnosticResultValuesRow {
  report_id: string; // UUID
  test_definition_id: string | null; // UUID
  analyte_code: string; // VARCHAR(128)
  analyte_name: string; // VARCHAR(255)
  value_numeric: string | null; // NUMERIC(18, 6)
  value_text: string | null; // TEXT
  unit: string | null; // VARCHAR(64)
  reference_range: string | null; // VARCHAR(255)
  abnormal_flag: string | null; // VARCHAR(32)
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
