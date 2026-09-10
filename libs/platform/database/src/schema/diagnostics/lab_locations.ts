/** Raw PostgreSQL row shape for `diagnostics.lab_locations`. */
export interface DiagnosticsLabLocationsRow {
  lab_provider_id: string; // UUID
  location_id: string; // UUID
  collection_supported: boolean; // BOOLEAN
  home_collection_supported: boolean; // BOOLEAN
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
