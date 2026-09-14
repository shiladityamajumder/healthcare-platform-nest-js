// * Describes the raw PostgreSQL row shape for the support.sla_policies table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `support.sla_policies`. */
export interface SupportSlaPoliciesRow {
  code: string; // VARCHAR(64)
  name: string; // VARCHAR(128)
  category: string | null; // VARCHAR(64)
  priority: string | null; // VARCHAR(16)
  first_response_minutes: number; // INTEGER
  resolution_minutes: number; // INTEGER
  business_hours_only: boolean; // BOOLEAN
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
