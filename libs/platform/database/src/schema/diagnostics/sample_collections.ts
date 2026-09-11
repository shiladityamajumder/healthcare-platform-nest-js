// * Linked with: database repositories, migrations, and transaction code.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `diagnostics.sample_collections`. */
// * Describe the database row shape consumed by repositories and transaction code.
export interface DiagnosticsSampleCollectionsRow {
  diagnostic_order_id: string; // UUID
  collector_user_id: string | null; // UUID
  scheduled_at: Date | null; // TIMESTAMP WITH TIME ZONE
  arrived_at: Date | null; // TIMESTAMP WITH TIME ZONE
  collected_at: Date | null; // TIMESTAMP WITH TIME ZONE
  status: string; // VARCHAR(32)
  notes: string | null; // TEXT
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
