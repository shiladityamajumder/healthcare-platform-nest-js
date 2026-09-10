// Linked with: database repositories, migrations, and transaction code.
// Used by: the package code that imports this component.
// Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `support.sla_policies`. */
// Describe the database row shape consumed by repositories and transaction code.
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
