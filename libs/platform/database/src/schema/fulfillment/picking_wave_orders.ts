/** Raw PostgreSQL row shape for `fulfillment.picking_wave_orders`. */
export interface FulfillmentPickingWaveOrdersRow {
  wave_id: string; // UUID
  fulfillment_order_id: string; // UUID
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
