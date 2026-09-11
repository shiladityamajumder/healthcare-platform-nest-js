// * Linked with: database repositories, migrations, and transaction code.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `identity.user_roles`. */
// * Describe the database row shape consumed by repositories and transaction code.
export interface IdentityUserRolesRow {
  user_id: string; // UUID
  role_id: string; // UUID
  scope_type: string | null; // VARCHAR(32)
  scope_id: string | null; // UUID
  valid_from: Date | null; // TIMESTAMP WITH TIME ZONE
  valid_until: Date | null; // TIMESTAMP WITH TIME ZONE
  is_active: boolean; // BOOLEAN
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
