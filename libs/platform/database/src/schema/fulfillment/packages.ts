/** Raw PostgreSQL row shape for `fulfillment.packages`. */
export interface FulfillmentPackagesRow {
  fulfillment_order_id: string; // UUID
  pack_task_id: string | null; // UUID
  package_number: string; // VARCHAR(64)
  packed_by_user_id: string | null; // UUID
  packaging_type: string | null; // VARCHAR(32)
  weight_grams: number | null; // INTEGER
  dimensions_json: unknown; // JSONB
  temperature_controlled: boolean; // BOOLEAN
  tamper_seal_number: string | null; // VARCHAR(128)
  status: string; // VARCHAR(32)
  packed_at: Date | null; // TIMESTAMP WITH TIME ZONE
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
