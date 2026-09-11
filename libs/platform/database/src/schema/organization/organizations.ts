// * Linked with: database repositories, migrations, and transaction code.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `organization.organizations`. */
// * Describe the database row shape consumed by repositories and transaction code.
export interface OrganizationOrganizationsRow {
  legal_name: string; // VARCHAR(255)
  trade_name: string | null; // VARCHAR(255)
  organization_type: string; // VARCHAR(32)
  tax_id: string | null; // VARCHAR(64)
  registration_number: string | null; // VARCHAR(128)
  status: string; // VARCHAR(16)
  metadata_json: unknown; // JSONB
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
