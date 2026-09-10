/** Raw PostgreSQL row shape for `catalog.brands`. */
export interface CatalogBrandsRow {
  name: string; // VARCHAR(255)
  slug: string; // VARCHAR(255)
  description: string | null; // TEXT
  logo_file_id: string | null; // UUID
  owner_organization_id: string | null; // UUID
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
