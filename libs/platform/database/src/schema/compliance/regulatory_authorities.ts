// * Describes the raw PostgreSQL row shape for the compliance.regulatory_authorities table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `compliance.regulatory_authorities`. */
export interface ComplianceRegulatoryAuthoritiesRow {
  code: string; // VARCHAR(64)
  name: string; // VARCHAR(255)
  jurisdiction: string; // VARCHAR(128)
  authority_type: string; // VARCHAR(64)
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
