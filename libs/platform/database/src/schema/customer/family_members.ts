// Linked with: database repositories, migrations, and transaction code.
// Used by: the package code that imports this component.
// Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `customer.family_members`. */
// Describe the database row shape consumed by repositories and transaction code.
export interface CustomerFamilyMembersRow {
  customer_user_id: string; // UUID
  linked_user_id: string | null; // UUID
  name: string; // VARCHAR(150)
  relationship: string; // VARCHAR(64)
  date_of_birth: string | null; // DATE
  gender: string | null; // VARCHAR(32)
  is_dependent: boolean; // BOOLEAN
  guardian_user_id: string | null; // UUID
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
