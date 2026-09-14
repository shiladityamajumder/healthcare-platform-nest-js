// * Describes the raw PostgreSQL row shape for the catalog.substitution_groups table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `catalog.substitution_groups`. */
export interface CatalogSubstitutionGroupsRow {
  salt_signature: string; // VARCHAR(512)
  dosage_form_id: string | null; // UUID
  strength_signature: string | null; // VARCHAR(255)
  is_active: boolean; // BOOLEAN
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
