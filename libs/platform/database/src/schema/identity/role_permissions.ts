/** Raw PostgreSQL row shape for `identity.role_permissions`. */
export interface IdentityRolePermissionsRow {
  role_id: string; // UUID
  permission_id: string; // UUID
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
