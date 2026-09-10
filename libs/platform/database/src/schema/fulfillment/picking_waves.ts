/** Raw PostgreSQL row shape for `fulfillment.picking_waves`. */
export interface FulfillmentPickingWavesRow {
  wave_number: string; // VARCHAR(64)
  warehouse_id: string; // UUID
  status: string; // VARCHAR(32)
  strategy: string; // VARCHAR(32)
  released_at: Date | null; // TIMESTAMP WITH TIME ZONE
  completed_at: Date | null; // TIMESTAMP WITH TIME ZONE
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
