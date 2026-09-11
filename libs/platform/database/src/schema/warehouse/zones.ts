// * Linked with: database repositories, migrations, and transaction code.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `warehouse.zones`. */
// * Describe the database row shape consumed by repositories and transaction code.
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
