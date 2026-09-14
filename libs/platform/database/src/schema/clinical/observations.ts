// * Describes the raw PostgreSQL row shape for the clinical.observations table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `clinical.observations`. */
export interface ClinicalObservationsRow {
  patient_profile_id: string; // UUID
  consultation_id: string | null; // UUID
  code_system: string | null; // VARCHAR(64)
  code: string | null; // VARCHAR(64)
  display: string; // VARCHAR(255)
  value_quantity: string | null; // NUMERIC(18, 6)
  value_unit: string | null; // VARCHAR(32)
  value_text: string | null; // TEXT
  value_json: unknown; // JSONB
  observed_at: Date; // TIMESTAMP WITH TIME ZONE
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
