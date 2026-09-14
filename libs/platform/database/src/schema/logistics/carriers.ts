// * Describes the raw PostgreSQL row shape for the logistics.carriers table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `logistics.carriers`. */
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
