// * Describes the raw PostgreSQL row shape for the search.indexing_jobs table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `search.indexing_jobs`. */
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
