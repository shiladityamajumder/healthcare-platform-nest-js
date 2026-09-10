/** Raw PostgreSQL row shape for `catalog.dosage_forms`. */
export interface CatalogDosageFormsRow {
  code: string; // VARCHAR(64)
  name: string; // VARCHAR(128)
  route_of_administration: string | null; // VARCHAR(64)
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
