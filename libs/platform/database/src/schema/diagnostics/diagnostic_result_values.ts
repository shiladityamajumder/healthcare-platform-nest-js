/** Raw PostgreSQL row shape for `diagnostics.diagnostic_result_values`. */
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
