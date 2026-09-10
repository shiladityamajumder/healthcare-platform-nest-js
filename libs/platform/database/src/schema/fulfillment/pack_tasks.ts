/** Raw PostgreSQL row shape for `fulfillment.pack_tasks`. */
export interface FulfillmentPackTasksRow {
  fulfillment_order_id: string; // UUID
  assigned_to_user_id: string | null; // UUID
  status: string; // VARCHAR(32)
  started_at: Date | null; // TIMESTAMP WITH TIME ZONE
  completed_at: Date | null; // TIMESTAMP WITH TIME ZONE
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
