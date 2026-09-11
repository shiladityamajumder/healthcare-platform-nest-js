// * Linked with: database repositories, migrations, and transaction code.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `logistics.carriers`. */
// * Describe the database row shape consumed by repositories and transaction code.
export interface LogisticsCarriersRow {
  code: string; // VARCHAR(64)
  name: string; // VARCHAR(128)
  integration_type: string; // VARCHAR(32)
  credentials_secret_ref: string | null; // VARCHAR(255)
  supports_cod: boolean; // BOOLEAN
  supports_reverse: boolean; // BOOLEAN
  supports_cold_chain: boolean; // BOOLEAN
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
