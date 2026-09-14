// * Describes the raw PostgreSQL row shape for the search.synonyms table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `search.synonyms`. */
export interface SearchSynonymsRow {
  locale: string; // VARCHAR(16)
  term: string; // VARCHAR(255)
  synonym: string; // VARCHAR(255)
  direction: string; // VARCHAR(16)
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
