// Linked with: database repositories, migrations, and transaction code.
// Used by: the package code that imports this component.
// Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `identity.user_profiles`. */
// Describe the database row shape consumed by repositories and transaction code.
export interface IdentityUserProfilesRow {
  user_id: string; // UUID
  first_name: string | null; // VARCHAR(100)
  last_name: string | null; // VARCHAR(100)
  preferred_name: string | null; // VARCHAR(100)
  avatar_file_id: string | null; // UUID
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
