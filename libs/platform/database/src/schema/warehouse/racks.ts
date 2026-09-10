/** Raw PostgreSQL row shape for `warehouse.racks`. */
export interface WarehouseRacksRow {
  warehouse_id: string; // UUID
  aisle_id: string; // UUID
  code: string; // VARCHAR(64)
  rack_type: string | null; // VARCHAR(32)
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
