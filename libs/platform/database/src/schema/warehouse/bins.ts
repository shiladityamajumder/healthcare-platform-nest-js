/** Raw PostgreSQL row shape for `warehouse.bins`. */
export interface WarehouseBinsRow {
  warehouse_id: string; // UUID
  zone_id: string; // UUID
  rack_id: string | null; // UUID
  code: string; // VARCHAR(128)
  bin_type: string; // VARCHAR(32)
  status: string; // VARCHAR(32)
  capacity_json: unknown; // JSONB
  pick_sequence: number | null; // INTEGER
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
