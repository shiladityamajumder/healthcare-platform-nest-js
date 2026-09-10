// Linked with: database repositories, migrations, and transaction code.
// Used by: the package code that imports this component.
// Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `clinical.observations`. */
// Describe the database row shape consumed by repositories and transaction code.
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
