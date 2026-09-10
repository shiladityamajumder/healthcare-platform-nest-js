/** Raw PostgreSQL row shape for `warehouse.inventory_adjustments`. */
export interface WarehouseInventoryAdjustmentsRow {
  adjustment_number: string; // VARCHAR(64)
  warehouse_id: string; // UUID
  reason_code: string; // VARCHAR(64)
  status: string; // VARCHAR(32)
  requested_by_user_id: string; // UUID
  approved_by_user_id: string | null; // UUID
  posted_at: Date | null; // TIMESTAMP WITH TIME ZONE
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
