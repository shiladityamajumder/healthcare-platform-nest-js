// * Describes the raw PostgreSQL row shape for the warehouse.zones table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `warehouse.zones`. */
export interface WarehouseZonesRow {
  warehouse_id: string; // UUID
  code: string; // VARCHAR(64)
  name: string; // VARCHAR(128)
  zone_type: string; // VARCHAR(32)
  temperature_min_c: string | null; // NUMERIC(6, 2)
  temperature_max_c: string | null; // NUMERIC(6, 2)
  humidity_min: string | null; // NUMERIC(6, 2)
  humidity_max: string | null; // NUMERIC(6, 2)
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
