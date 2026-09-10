/** Raw PostgreSQL row shape for `warehouse.warehouses`. */
export interface WarehouseWarehousesRow {
  organization_id: string; // UUID
  location_id: string; // UUID
  code: string; // VARCHAR(64)
  name: string; // VARCHAR(150)
  warehouse_type: string; // VARCHAR(32)
  status: string; // VARCHAR(32)
  supports_cold_chain: boolean; // BOOLEAN
  supports_controlled_drugs: boolean; // BOOLEAN
  operating_hours: unknown; // JSONB
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
