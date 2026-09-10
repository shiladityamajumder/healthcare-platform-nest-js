// Linked with: database repositories, migrations, and transaction code.
// Used by: the package code that imports this component.
// Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `risk.blocklists`. */
// Describe the database row shape consumed by repositories and transaction code.
export interface RiskBlocklistsRow {
  entity_type: string; // VARCHAR(32)
  entity_hash: string; // VARCHAR(255)
  reason_code: string; // VARCHAR(64)
  status: string; // VARCHAR(32)
  expires_at: Date | null; // TIMESTAMP WITH TIME ZONE
  source_case_id: string | null; // UUID
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
