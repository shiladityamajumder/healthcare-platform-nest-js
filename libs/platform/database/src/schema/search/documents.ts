// * Describes the raw PostgreSQL row shape for the search.documents table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `search.documents`. */
export interface SearchDocumentsRow {
  entity_type: string; // VARCHAR(64)
  entity_id: string; // UUID
  locale: string; // VARCHAR(16)
  document: unknown; // JSONB
  content_hash: string; // VARCHAR(64)
  index_status: string; // VARCHAR(32)
  indexed_at: Date | null; // TIMESTAMP WITH TIME ZONE
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
