// * Describes the raw PostgreSQL row shape for the organization.organizations table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `organization.organizations`. */
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
