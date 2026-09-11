// * Linked with: database repositories, migrations, and transaction code.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `search.query_events`. */
// * Describe the database row shape consumed by repositories and transaction code.
export interface SearchQueryEventsRow {
  user_id: string | null; // UUID
  session_id: string | null; // VARCHAR(128)
  query_raw: string; // TEXT
  query_normalized: string; // VARCHAR(512)
  filters: unknown; // JSONB
  result_count: number; // INTEGER
  selected_entity_type: string | null; // VARCHAR(64)
  selected_entity_id: string | null; // UUID
  id: string; // UUID
  created_at: Date; // TIMESTAMP WITH TIME ZONE
}
