// * Describes the raw PostgreSQL row shape for the organization.locations table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `organization.locations`. */
export interface OrganizationLocationsRow {
  organization_id: string; // UUID
  location_type: string; // VARCHAR(32)
  code: string; // VARCHAR(64)
  name: string; // VARCHAR(150)
  address_json: unknown; // JSONB
  postal_code: string | null; // VARCHAR(16)
  timezone: string; // VARCHAR(64)
  is_active: boolean; // BOOLEAN
  hfr_id: string | null; // VARCHAR(128)
  geo_metadata: unknown; // JSONB
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
