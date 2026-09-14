// * Describes the raw PostgreSQL row shape for the compliance.regulatory_registrations table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `compliance.regulatory_registrations`. */
export interface ComplianceRegulatoryRegistrationsRow {
  authority_id: string; // UUID
  organization_id: string | null; // UUID
  location_id: string | null; // UUID
  registration_type: string; // VARCHAR(64)
  registration_number: string; // VARCHAR(128)
  issued_at: string | null; // DATE
  expires_at: string | null; // DATE
  verification_status: string; // VARCHAR(16)
  document_file_id: string | null; // UUID
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
