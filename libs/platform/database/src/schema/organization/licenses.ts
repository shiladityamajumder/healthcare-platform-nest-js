// * Linked with: database repositories, migrations, and transaction code.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `organization.licenses`. */
// * Describe the database row shape consumed by repositories and transaction code.
export interface OrganizationLicensesRow {
  organization_id: string; // UUID
  location_id: string | null; // UUID
  license_type: string; // VARCHAR(64)
  license_number: string; // VARCHAR(128)
  issued_by: string | null; // VARCHAR(255)
  issued_at: string | null; // DATE
  expires_at: string | null; // DATE
  document_file_id: string | null; // UUID
  verification_status: string; // VARCHAR(16)
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
