/** Raw PostgreSQL row shape for `catalog.units_of_measure`. */
export interface CatalogUnitsOfMeasureRow {
  code: string; // VARCHAR(32)
  name: string; // VARCHAR(64)
  dimension: string; // VARCHAR(32)
  conversion_to_base: string; // NUMERIC(18, 8)
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
