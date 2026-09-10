// Linked with: database repositories, migrations, and transaction code.
// Used by: the package code that imports this component.
// Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `search.documents`. */
// Describe the database row shape consumed by repositories and transaction code.
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
