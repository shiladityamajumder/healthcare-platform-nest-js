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
