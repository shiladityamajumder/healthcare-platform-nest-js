// * Linked with: database repositories, migrations, and transaction code.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `search.indexing_jobs`. */
// * Describe the database row shape consumed by repositories and transaction code.
export interface SearchIndexingJobsRow {
  entity_type: string; // VARCHAR(64)
  entity_id: string; // UUID
  operation: string; // VARCHAR(16)
  payload: unknown; // JSONB
  status: string; // VARCHAR(32)
  attempts: number; // INTEGER
  available_at: Date; // TIMESTAMP WITH TIME ZONE
  last_error: string | null; // TEXT
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
